import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Opportunity, STAGE_CONFIG } from "@/types/opportunity";
import { Building2, User, Briefcase, FileText, Activity } from "lucide-react";

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onUpdate: (updates: Partial<Opportunity>) => void;
}

const OpportunityDetailModal = ({ opportunity, onClose, onUpdate }: OpportunityDetailModalProps) => {
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
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents yet</p>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No activities yet</p>
            </div>
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
