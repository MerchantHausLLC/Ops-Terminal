import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Account } from "@/types/opportunity";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setAccounts(data as Account[]);
      }
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center px-6 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground">Accounts</h1>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Website</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="hover:bg-muted/50">
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.city || '-'}</TableCell>
                    <TableCell>{account.state || '-'}</TableCell>
                    <TableCell>{account.country || '-'}</TableCell>
                    <TableCell>
                      {account.website ? (
                        <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                          {account.website}
                        </a>
                      ) : (
                        '-' )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Accounts;