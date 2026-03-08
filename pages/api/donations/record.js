import supabase from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { requestId, donor, amount, transactionHash, message } = req.body;

    // Validate inputs
    if (!requestId || !donor || !amount || !transactionHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get current request data
    const { data: request, error: fetchError } = await supabase
      .from('requests')
      .select('raised, donors')
      .eq('id', requestId)
      .single();

    if (fetchError) {
      console.error('Error fetching request:', fetchError);
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request with new donation
    const newRaised = (parseFloat(request.raised) || 0) + parseFloat(amount);
    const newDonors = (request.donors || 0) + 1;

    const { error: updateError } = await supabase
      .from('requests')
      .update({
        raised: newRaised,
        donors: newDonors,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      console.error('Error updating request:', updateError);
      return res.status(500).json({ error: 'Failed to update donation stats' });
    }

    // Record donation in donations table (if you want to track individual donations)
    // For now, we just update the aggregate stats

    return res.status(200).json({
      success: true,
      message: 'Donation recorded successfully',
      raised: newRaised,
      donors: newDonors
    });

  } catch (error) {
    console.error('Record donation error:', error);
    return res.status(500).json({ 
      error: 'Failed to record donation',
      details: error.message 
    });
  }
}
