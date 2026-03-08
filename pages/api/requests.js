import supabase from '../../lib/supabaseClient';

// Generate unique ID
const generateId = () => {
  return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all requests or filter by query params
      try {
        const { type, status, id } = req.query;
        
        // If requesting a specific ID
        if (id) {
          const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error('Supabase GET by ID error:', error);
            return res.status(404).json({ error: 'Request not found' });
          }
          
          return res.status(200).json(data);
        }
        
        // Build query
        let query = supabase
          .from('requests')
          .select('*')
          .order('submitted_at', { ascending: false });
        
        // Apply filters
        if (type) {
          query = query.eq('type', type);
        }
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase GET error:', error);
          return res.status(500).json({ error: 'Failed to fetch requests' });
        }
        
        return res.status(200).json(data || []);
      } catch (error) {
        console.error('GET error:', error);
        return res.status(500).json({ error: 'Failed to fetch requests' });
      }

    case 'POST':
      // Create a new request
      try {
        const requestData = req.body;
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'location', 'needs', 'targetAmount', 'description', 'walletAddress'];
        const missingFields = requiredFields.filter(field => !requestData[field]);
        
        if (missingFields.length > 0) {
          return res.status(400).json({ 
            error: 'Missing required fields', 
            fields: missingFields 
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(requestData.email)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate target amount
        if (isNaN(parseFloat(requestData.targetAmount)) || parseFloat(requestData.targetAmount) <= 0) {
          return res.status(400).json({ error: 'Invalid target amount' });
        }

        // Create new request object (auto-approved)
        const newRequest = {
          id: generateId(),
          type: requestData.type || 'student',
          status: 'approved', // Auto-approve all requests
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone || null,
          location: requestData.location,
          school: requestData.school || null,
          organization_name: requestData.organizationName || null,
          organization_type: requestData.organizationType || null,
          beneficiaries: requestData.beneficiaries ? parseInt(requestData.beneficiaries) : null,
          needs: requestData.needs,
          target_amount: parseFloat(requestData.targetAmount),
          description: requestData.description,
          proof_documents: requestData.proofDocuments || null,
          wallet_address: requestData.walletAddress,
          raised: 0,
          donors: 0,
          review_notes: null,
          reviewed_at: null,
        };

        // Insert into Supabase
        const { data, error } = await supabase
          .from('requests')
          .insert([newRequest])
          .select()
          .single();
        
        if (error) {
          console.error('Supabase INSERT error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          return res.status(500).json({ 
            error: 'Failed to save request',
            details: error.message,
            hint: error.hint
          });
        }

        // Blockchain integration can be added separately via admin panel
        // For now, requests are instantly available for direct wallet donations
        
        return res.status(201).json({ 
          message: 'Request submitted successfully and added to blockchain', 
          request: data 
        });
      } catch (error) {
        console.error('POST error:', error);
        return res.status(500).json({ error: 'Failed to create request' });
      }

    case 'PUT':
      // Update an existing request (for admin purposes)
      try {
        const { id } = req.query;
        const updateData = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'Request ID is required' });
        }

        // Map camelCase to snake_case for database
        const dbUpdateData = {};
        if (updateData.status) dbUpdateData.status = updateData.status;
        if (updateData.reviewNotes) dbUpdateData.review_notes = updateData.reviewNotes;
        if (updateData.reviewedAt) dbUpdateData.reviewed_at = updateData.reviewedAt;
        if (updateData.raised !== undefined) dbUpdateData.raised = updateData.raised;
        if (updateData.donors !== undefined) dbUpdateData.donors = updateData.donors;

        // Update in Supabase
        const { data, error } = await supabase
          .from('requests')
          .update(dbUpdateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase UPDATE error:', error);
          return res.status(404).json({ error: 'Request not found or failed to update' });
        }
        
        return res.status(200).json({ 
          message: 'Request updated successfully', 
          request: data 
        });
      } catch (error) {
        console.error('PUT error:', error);
        return res.status(500).json({ error: 'Failed to update request' });
      }

    case 'DELETE':
      // Delete a request (for admin purposes)
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ error: 'Request ID is required' });
        }

        // Delete from Supabase
        const { error } = await supabase
          .from('requests')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Supabase DELETE error:', error);
          return res.status(404).json({ error: 'Request not found' });
        }
        
        return res.status(200).json({ message: 'Request deleted successfully' });
      } catch (error) {
        console.error('DELETE error:', error);
        return res.status(500).json({ error: 'Failed to delete request' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
