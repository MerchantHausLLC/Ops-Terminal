-- Create accounts table (Business)
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contacts table (Person)
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  fax TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table (Onboarding Pipeline)
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'application_started',
  referral_source TEXT,
  username TEXT,
  processing_services TEXT[],
  value_services TEXT[],
  agree_to_terms BOOLEAN DEFAULT false,
  timezone TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- RLS policies for accounts (public access for now)
CREATE POLICY "Anyone can view accounts" ON public.accounts FOR SELECT USING (true);
CREATE POLICY "Anyone can create accounts" ON public.accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update accounts" ON public.accounts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete accounts" ON public.accounts FOR DELETE USING (true);

-- RLS policies for contacts
CREATE POLICY "Anyone can view contacts" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Anyone can create contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contacts" ON public.contacts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contacts" ON public.contacts FOR DELETE USING (true);

-- RLS policies for opportunities
CREATE POLICY "Anyone can view opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Anyone can create opportunities" ON public.opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update opportunities" ON public.opportunities FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete opportunities" ON public.opportunities FOR DELETE USING (true);

-- Update triggers for updated_at
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for foreign keys
CREATE INDEX idx_contacts_account_id ON public.contacts(account_id);
CREATE INDEX idx_opportunities_account_id ON public.opportunities(account_id);
CREATE INDEX idx_opportunities_contact_id ON public.opportunities(contact_id);
CREATE INDEX idx_opportunities_stage ON public.opportunities(stage);