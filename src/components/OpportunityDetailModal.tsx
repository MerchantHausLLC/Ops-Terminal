import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Opportunity, STAGE_CONFIG, Document, Activity as ActivityType } from "@/types/opportunity";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Building2, User, Briefcase, FileText, Activity } from "lucide-react";

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onUpdate: (updates: Partial<Opportunity>) => void;
}

const OpportunityDetailModal = ({ opportunity, onClose, onUpdate }: OpportunityDetailModalProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [activityType, setActivityType] = useState('');
  const [activityDescription, setActivityDescription] = useState('');

  // Fetch related documents and activities when an opportunity is selected
  useEffect(() => {
    const fetchRelated = async () => {
      if (!opportunity) return;
      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .eq('opportunity_id', opportunity.id)
        .order('uploaded_at', { ascending: true });
      setDocuments(docs || []);

      const { data: acts } = await supabase
        .from('activities')
        .select('*')
        .eq('opportunity_id', opportunity.id)
        .order('created_at', { ascending: true });
      setActivities(acts || []);
    };
    fetchRelated();
  }, [opportunity]);

  // Handlers to add new document and activity
  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;
    if (!docName || !docUrl) {
      toast({ title: 'Missing fields', description: 'Please provide both name and URL.', variant: 'destructive' });
      return;
    }
    const { data, error } = await supabase
      .from('documents')
      .insert({ opportunity_id: opportunity.id, name: docName, url: docUrl })
      .select()
      .single();
    if (error) {
      toast({ title: 'Error adding document', description: error.message, variant: 'destructive' });
    } else {
      setDocuments([...documents, data as Document]);
      setDocName('');
      setDocUrl('');
      toast({ title: 'Document added', description: `${data.name} was added.` });
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity) return;
    if (!activityType) {
      toast({ title: 'Missing type', description: 'Please specify an activity type.', variant: 'destructive' });
      return;
    }
    const { data, error } = await supabase
      .from('activities')
      .insert({ opportunity_id: opportunity.id, type: activityType, description: activityDescription || null })
      .select()
      .single();
    if (error) {
      toast({ title: 'Error adding activity', description: error.message, variant: 'destructive' });
    } else {
      setActivities([...activities, data as ActivityType]);
      setActivityType('');
      setActivityDescription('');
      toast({ title: 'Activity added', description: `An activity of type ${data.type} was added.` });
    }
  };

  if (!opportunity) return null;

  const account = opportunity.account;
  const contact = opportunity.contact;
  const stageConfig = STAGE_CONFIG[opportunity.stage];

  return (
    <Dialog open={!!opportunity} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{account?.name || 'Unknown Business'}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${stageConfig.colorClass}`} />
                <span className="text-sm text-muted-foreground">{stageConfig.label}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="account" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account" className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="opportunity" className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Opportunity</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Activities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Company Name" value={account?.name} />
              <InfoItem label="Website" value={account?.website} />
              <InfoItem label="Address" value={account?.address1} />
              <InfoItem label="Address 2" value={account?.address2} />
              <InfoItem label="City" value={account?.city} />
              <InfoItem label="State" value={account?.state} />
              <InfoItem label="Zip" value={account?.zip} />
              <InfoItem label="Country" value={account?.country} />
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="First Name" value={contact?.first_name} />
              <InfoItem label="Last Name" value={contact?.last_name} />
              <InfoItem label="Email" value={contact?.email} />
              <InfoItem label="Phone" value={contact?.phone} />
              <InfoItem label="Fax" value={contact?.fax} />
            </div>
          </TabsContent>

          <TabsContent value="opportunity" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Stage" value={stageConfig.label} />
              <InfoItem label="Username" value={opportunity.username} />
              <InfoItem label="Referral Source" value={opportunity.referral_source} />
              <InfoItem label="Timezone" value={opportunity.timezone} />
              <InfoItem label="Language" value={opportunity.language} />
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Processing Services</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {opportunity.processing_services?.map((service) => (
                    <span 
                      key={service}
                      className="text-sm bg-muted px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  )) || <span className="text-sm text-muted-foreground">None</span>}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            {/* Documents list */}
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents yet</p>
              </div>
            ) : (
              <ul className="space-y-2 mb-4">
                {documents.map((doc) => (
                  <li key={doc.id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline break-all">
                        {doc.url}
                      </a>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
            {/* Add document form */}
            <form onSubmit={handleAddDocument} className="space-y-2">
              <Input
                placeholder="Document Name"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
              <Input
                placeholder="Document URL"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm">Add Document</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            {/* Activities list */}
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No activities yet</p>
              </div>
            ) : (
              <ul className="space-y-2 mb-4">
                {activities.map((act) => (
                  <li key={act.id} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{act.type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(act.created_at).toLocaleDateString()}</span>
                    </div>
                    {act.description && (
                      <p className="text-sm mt-1 text-muted-foreground whitespace-pre-line">
                        {act.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {/* Add activity form */}
            <form onSubmit={handleAddActivity} className="space-y-2">
              <Input
                placeholder="Activity Type (e.g. Call, Email, Note)"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm">Add Activity</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
    <p className="text-sm mt-0.5">{value || '-'}</p>
  </div>
);

export default OpportunityDetailModal;
