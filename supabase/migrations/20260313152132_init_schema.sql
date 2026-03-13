-- 1. Create Profiles Table (extends the default auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  native_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Health Profiles Table (The Core Logic)
CREATE TABLE health_profiles (
  user_id UUID REFERENCES profiles(id) NOT NULL PRIMARY KEY,
  allergies TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Scan History Table
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  image_url TEXT,
  extracted_text TEXT,
  translated_result JSONB, -- Stores the Lingo.dev output
  risk_level TEXT CHECK (risk_level IN ('safe', 'warning', 'danger')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);