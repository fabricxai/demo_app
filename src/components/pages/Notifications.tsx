import { useState } from 'react';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { SmartTable, Column, StatusBadge } from '../SmartTable';
import { Bell, CheckCircle, AlertTriangle, Clock, Mail, Calendar, User, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    title: 'Approval Required',
    message: 'Purchase Order #PO-2845 requires your approval',
    type: 'warning',
    category: 'Approvals',
    timestamp: '2024-10-26 14:30',
    read: false,
    actionUrl: '/approve'
  },
  {
    id: 2,
    title: 'RFQ Response Received',
    message: 'New quotation received for RFQ-2024-089',
    type: 'info',
    category: 'RFQ',
    timestamp: '2024-10-26 13:15',
    read: false,
    actionUrl: '/sales/rfq'
  },
  {
    id: 3,
    title: 'Machine Maintenance Due',
    message: 'Sewing Machine #SM-042 requires scheduled maintenance',
    type: 'warning',
    category: 'Maintenance',
    timestamp: '2024-10-26 10:00',
    read: true,
    actionUrl: '/resources/machines'
  },
  {
    id: 4,
    title: 'Quality Issue Resolved',
    message: 'Batch #QE-102 quality exception has been resolved',
    type: 'success',
    category: 'Quality',
    timestamp: '2024-10-25 16:45',
    read: true,
    actionUrl: '/quality/qc'
  },
  {
    id: 5,
    title: 'Low Stock Alert',
    message: 'Cotton fabric inventory below reorder point',
    type: 'error',
    category: 'Inventory',
    timestamp: '2024-10-25 09:20',
    read: false,
    actionUrl: '/operations/inventory'
  },
  {
    id: 6,
    title: 'Shipment Delayed',
    message: 'Shipment #SH-1234 delayed by 2 days due to customs',
    type: 'warning',
    category: 'Shipment',
    timestamp: '2024-10-24 18:30',
    read: true,
    actionUrl: '/operations/shipment'
  },
  {
    id: 7,
    title: 'New Lead Assigned',
    message: 'Lead from H&M Europe has been assigned to you',
    type: 'info',
    category: 'CRM',
    timestamp: '2024-10-24 11:15',
    read: false,
    actionUrl: '/crm/leads'
  },
];

const columns: Column[] = [
  {
    key: 'type',
    label: 'Type',
    render: (value: string) => {
      const icons = {
        info: <Bell className="w-4 h-4 text-[#57ACAF]" />,
        success: <CheckCircle className="w-4 h-4 text-green-400" />,
        warning: <AlertTriangle className="w-4 h-4 text-[#EAB308]" />,
        error: <AlertTriangle className="w-4 h-4 text-red-400" />,
      };
      return <div className="flex items-center justify-center">{icons[value as keyof typeof icons]}</div>;
    }
  },
  { 
    key: 'title', 
    label: 'Title', 
    sortable: true,
    render: (value: string, row: Notification) => (
      <div className="flex items-center gap-2">
        <span className={row.read ? 'text-[#6F83A7]' : 'text-white font-medium'}>{value}</span>
        {!row.read && <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>}
      </div>
    )
  },
  { key: 'message', label: 'Message', sortable: true },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (value: string) => (
      <Badge variant="outline" className="bg-white/5 border-white/10 text-[#6F83A7]">
        {value}
      </Badge>
    )
  },
  { 
    key: 'timestamp', 
    label: 'Time', 
    sortable: true,
    render: (value: string) => (
      <span className="text-[#6F83A7] text-sm">{value}</span>
    )
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeView, setActiveView] = useState('all');

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getFilteredData = () => {
    switch (activeView) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'approvals':
        return notifications.filter(n => n.category === 'Approvals');
      case 'alerts':
        return notifications.filter(n => n.type === 'warning' || n.type === 'error');
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const approvalsCount = notifications.filter(n => n.category === 'Approvals').length;
  const alertsCount = notifications.filter(n => n.type === 'warning' || n.type === 'error').length;
  const todayCount = notifications.filter(n => n.timestamp.startsWith('2024-10-26')).length;

  return (
    <PageLayout breadcrumbs={[{ label: 'Notifications' }]}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Unread"
          value={unreadCount.toString()}
          icon={Mail}
          subtitle={`${notifications.length} total notifications`}
        />
        <KPICard
          title="Pending Approvals"
          value={approvalsCount.toString()}
          icon={Clock}
          subtitle="Requires your action"
        />
        <KPICard
          title="Alerts"
          value={alertsCount.toString()}
          icon={AlertTriangle}
          subtitle="Important alerts"
        />
        <KPICard
          title="Today"
          value={todayCount.toString()}
          icon={Calendar}
          subtitle="Received today"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
        >
          <Check className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="all" value={activeView} onValueChange={setActiveView}>
        <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-lg shadow-black/20 mb-6">
          <TabsList className="w-full bg-transparent border-0 p-0 h-auto grid grid-cols-4 gap-1.5">
            <TabsTrigger 
              value="all" 
              className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
            >
              <Bell className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="unread"
              className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
            >
              <Mail className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger 
              value="approvals"
              className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
            >
              <Clock className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
              Approvals ({approvalsCount})
            </TabsTrigger>
            <TabsTrigger 
              value="alerts"
              className="py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] transition-all duration-300 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 mr-2 group-data-[state=active]:scale-110 transition-transform" />
              Alerts ({alertsCount})
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* Notifications Table */}
      <SmartTable
        title="Notifications"
        data={getFilteredData()}
        columns={columns}
        onRowClick={(row) => {
          handleMarkAsRead(row.id);
          if (row.actionUrl) {
            window.location.href = row.actionUrl;
          }
        }}
        searchPlaceholder="Search notifications..."
      />
    </PageLayout>
  );
}
