import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSchool, FaMapMarkerAlt, FaEnvelope, FaPhone, FaBook, FaMoneyBillWave, FaPaperPlane, FaWallet } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function RequestForm() {
  const [requestType, setRequestType] = useState('student'); // 'student' or 'organization'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    school: '',
    needs: '',
    targetAmount: '',
    description: '',
    organizationName: '',
    organizationType: '',
    beneficiaries: '',
    proofDocuments: '',
    walletAddress: '',
  });
  
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      
      setProofFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.location || !formData.needs || !formData.targetAmount || !formData.walletAddress) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Validate wallet address format
    if (!formData.walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum wallet address (starts with 0x)');
      setIsSubmitting(false);
      return;
    }

    // Additional validation for organization requests
    if (requestType === 'organization' && (!formData.organizationName || !formData.organizationType)) {
      toast.error('Please fill in organization details');
      setIsSubmitting(false);
      return;
    }

    try {
      let proofFileUrl = formData.proofDocuments;

      // Upload file if selected
      if (proofFile) {
        setUploading(true);
        toast.info('Uploading proof document...');
        
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Generate unique filename
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('proof-documents')
          .upload(filePath, proofFile);

        if (uploadError) {
          throw new Error('Failed to upload file: ' + uploadError.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('proof-documents')
          .getPublicUrl(filePath);

        proofFileUrl = publicUrl;
        toast.success('File uploaded successfully!');
      }

      // Send data to API
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: requestType,
          ...formData,
          proofDocuments: proofFileUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      // Success!
      toast.success(`Request submitted successfully! Your request ID is ${data.request.id}. We will review and get back to you soon.`);
      
      console.log('Request submitted:', data.request);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        school: '',
        needs: '',
        targetAmount: '',
        description: '',
        organizationName: '',
        organizationType: '',
        beneficiaries: '',
        proofDocuments: '',
        walletAddress: '',
      });
      setProofFile(null);
    } catch (error) {
      toast.error(error.message || 'Failed to submit request. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Request Type Toggle */}
      <div className="mb-8">
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRequestType('student')}
            className={`flex-1 max-w-xs py-4 px-6 rounded-xl font-semibold transition-all ${
              requestType === 'student'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                : 'glass-effect text-gray-700 hover:bg-white/80'
            }`}
          >
            <FaUser className="inline-block mr-2" />
            Student Request
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRequestType('organization')}
            className={`flex-1 max-w-xs py-4 px-6 rounded-xl font-semibold transition-all ${
              requestType === 'organization'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                : 'glass-effect text-gray-700 hover:bg-white/80'
            }`}
          >
            <FaSchool className="inline-block mr-2" />
            Organization Request
          </motion.button>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-effect rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-6 gradient-text">
          {requestType === 'student' ? 'Student Support Request' : 'Organization Funding Request'}
        </h2>

        <div className="space-y-6">
          {/* Personal/Organization Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline-block mr-2" />
                {requestType === 'student' ? 'Full Name' : 'Contact Person Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="inline-block mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="inline-block mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline-block mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, Country"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Organization-specific fields */}
          {requestType === 'organization' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaSchool className="inline-block mr-2" />
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required={requestType === 'organization'}
                  placeholder="Your organization name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required={requestType === 'organization'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="">Select type</option>
                  <option value="school">School</option>
                  <option value="ngo">NGO</option>
                  <option value="community">Community Organization</option>
                  <option value="charity">Charity</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Student-specific fields */}
          {requestType === 'student' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaSchool className="inline-block mr-2" />
                School/Institution Name
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Your school or institution"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {requestType === 'organization' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Beneficiaries *
              </label>
              <input
                type="number"
                name="beneficiaries"
                value={formData.beneficiaries}
                onChange={handleChange}
                required={requestType === 'organization'}
                placeholder="How many people will benefit?"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Funding Request Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaBook className="inline-block mr-2" />
              What do you need support for? *
            </label>
            <input
              type="text"
              name="needs"
              value={formData.needs}
              onChange={handleChange}
              required
              placeholder="e.g., School supplies, tuition fees, technology equipment"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaMoneyBillWave className="inline-block mr-2" />
              Target Amount (ETH) *
            </label>
            <input
              type="number"
              step="0.001"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              required
              placeholder="0.5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaWallet className="inline-block mr-2" />
              Ethereum Wallet Address *
            </label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              placeholder="0x..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              This is where you'll receive donations. Must start with 0x followed by 40 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Please provide a detailed description of your situation, why you need support, and how the funds will be used..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Supporting Documents / Proof
            </label>
            <div className="space-y-3">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  id="proofFile"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="proofFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {proofFile ? proofFile.name : 'Click to upload file'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPG, PNG, or PDF (Max 5MB)
                  </span>
                </label>
              </div>
              
              {/* Text Input (Alternative) */}
              <div className="text-center text-sm text-gray-600">or</div>
              <textarea
                name="proofDocuments"
                value={formData.proofDocuments}
                onChange={handleChange}
                rows={2}
                placeholder="Describe available documents (student ID, enrollment proof, etc.)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> All requests are subject to verification. We will review your request and contact you within 5-7 business days. Please ensure all information provided is accurate and truthful.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="spinner" />
                Uploading File...
              </>
            ) : isSubmitting ? (
              <>
                <div className="spinner" />
                Submitting Request...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Submit Request
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
