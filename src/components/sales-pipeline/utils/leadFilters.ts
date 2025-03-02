
import { Lead } from "@/lib/supabase/types";

export const filterLeads = (
  leads: Lead[], 
  searchTerm: string, 
  serviceTypeFilter: string | null,
  dateFilter: string,
  isArchived: boolean
) => {
  return leads.filter(lead => {
    // Filter by search term
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.serviceType && lead.serviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.notes && lead.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by service type
    const matchesServiceType = 
      !serviceTypeFilter || 
      lead.serviceType === serviceTypeFilter;
    
    // Filter by archive status
    const matchesArchiveStatus = 
      lead.isArchived === isArchived;
    
    // Filter by date
    let matchesDate = true;
    if (dateFilter !== "all" && lead.createdAt) {
      const createdDate = new Date(lead.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          matchesDate = createdDate.toDateString() === now.toDateString();
          break;
        case "week":
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = createdDate >= oneWeekAgo;
          break;
        case "month":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesDate = createdDate >= oneMonthAgo;
          break;
        case "quarter":
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          matchesDate = createdDate >= threeMonthsAgo;
          break;
      }
    }
    
    return matchesSearch && matchesServiceType && matchesArchiveStatus && matchesDate;
  });
};
