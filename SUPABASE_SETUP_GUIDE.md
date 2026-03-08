# 🚀 Supabase Setup Guide for Ledger Equity

This guide will help you set up Supabase as the database for your Ledger Equity donation platform.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using GitHub, Google, or email

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the details:
   - **Name**: `ledger-equity-donation-platform` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select **"Free"** (includes 500 MB database)
3. Click **"Create new project"**
4. Wait 1-2 minutes for the project to be created

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click on the **⚙️ Settings** icon in the left sidebar
2. Click on **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)
4. Copy both values - you'll need them in the next step

## Step 4: Configure Your Environment Variables

1. In your project root, create a `.env.local` file (or copy from `.env.example`)
2. Add your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ...
```

3. Replace the values with your actual credentials from Step 3

## Step 5: Create the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the `supabase_setup.sql` file in your project
4. Copy the entire SQL code from that file
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see a success message: "Database schema created successfully! ✅"

## Step 6: Verify the Setup

1. Click on **Table Editor** in the left sidebar
2. You should see a new table called **`requests`**
3. Click on it to see the table structure with all columns

## Step 7: Test the Integration

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3001/request`
3. Fill out and submit a test request
4. Go back to Supabase → **Table Editor** → **requests**
5. You should see your test request in the table!

## Step 8: Test Admin Functions

1. Visit `http://localhost:3001/admin/requests`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You should see your test request
4. Try approving it
5. Check the home page - it should now appear there!

## 🎉 You're All Set!

Your Ledger Equity platform is now connected to Supabase!

## 📊 Database Features

### Row Level Security (RLS)
The database has been configured with RLS policies:
- ✅ **Anyone** can view approved requests (public)
- ✅ **Anyone** can create new requests (submissions)
- ✅ **Authenticated users** can view/update/delete all requests (admin)

### Automatic Timestamps
The `updated_at` column automatically updates when a record is modified.

### Indexes
Optimized indexes for fast queries on:
- Status
- Type
- Submission date
- Email

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure your `.env.local` file exists
- Restart your Next.js dev server after adding environment variables

### Error: "relation 'requests' does not exist"
- You haven't run the SQL schema yet
- Go back to Step 5 and run the `supabase_setup.sql` script

### Requests not appearing in the database
- Check your Supabase credentials in `.env.local`
- Check the browser console for errors
- Verify RLS policies are enabled

### Can't approve/reject requests
- Make sure you're logged in as admin
- RLS policies require authentication for admin operations

## 🔒 Security Notes

1. **Never commit `.env.local`** to git (it's in `.gitignore`)
2. The `anon` key is safe to expose in the frontend
3. For production, set up proper authentication in Supabase
4. Change admin credentials in production

## 📚 Next Steps

- Set up email notifications for approved requests
- Add file upload for proof documents using Supabase Storage
- Implement proper admin authentication with Supabase Auth
- Add database backups (automatic in Supabase)

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Check the browser console for errors
- Check Supabase logs: Dashboard → Logs

---

**Happy Building! 🌍✨**
