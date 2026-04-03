import { useState, useEffect } from 'react';
import { useRouteSubpage } from '../../hooks/useRouteSubpage';
import { PageLayout } from '../PageLayout';
import { KPICard } from '../KPICard';
import { AICard } from '../AICard';
import { SmartTable, Column } from '../SmartTable';
import { DetailDrawer } from '../DetailDrawer';
import { WorkflowStepper } from '../WorkflowStepper';
import { MarbimAIButton } from '../MarbimAIButton';
import { WorkerDetailDrawer } from '../WorkerDetailDrawer';
import { AddWorkerDrawer } from '../AddWorkerDrawer';
import { ModuleSetupBanner } from '../ModuleSetupBanner';
import { WorkforceManagementSetup } from './WorkforceManagementSetup';
import { 
  Users, Clock, Award, TrendingDown, BookOpen, UserCheck,
  ChevronDown, Plus, Download, Filter, Upload, Sparkles,
  Calendar, Target, AlertTriangle, CheckCircle, Settings,
  BarChart3, Activity, TrendingUp, Shield, Clipboard,
  FileText, Search, Eye, X, Check, UserPlus, UserMinus,
  Zap, Brain, AlertCircle, Info, MapPin, Briefcase, ChevronRight,
  Layers, UserX, DollarSign, PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart as RechartsPie,
  Pie,
} from 'recharts';

// Dashboard Data
const dashboardSummary = [
  { label: 'Attendance %', value: '94.5%', icon: UserCheck, color: '#57ACAF' },
  { label: 'Overtime Hours', value: '1,245h', icon: Clock, color: '#EAB308' },
  { label: 'Skill Gaps', value: '8', icon: AlertTriangle, color: '#D0342C' },
  { label: 'Training Completion', value: '87%', icon: BookOpen, color: '#6F83A7' },
  { label: 'Attrition Rate', value: '2.3%', icon: TrendingDown, color: '#57ACAF' },
];

const attendanceTrendsData = [
  { date: 'Oct 20', attendance: 95.2, target: 95 },
  { date: 'Oct 21', attendance: 94.8, target: 95 },
  { date: 'Oct 22', attendance: 93.5, target: 95 },
  { date: 'Oct 23', attendance: 94.2, target: 95 },
  { date: 'Oct 24', attendance: 94.5, target: 95 },
  { date: 'Oct 25', attendance: 95.5, target: 95 },
  { date: 'Oct 26', attendance: 96.0, target: 95 },
];

const skillCoverageData = [
  { line: 'Line 1', cutting: 92, sewing: 88, finishing: 85 },
  { line: 'Line 2', cutting: 88, sewing: 90, finishing: 82 },
  { line: 'Line 3', cutting: 85, sewing: 85, finishing: 88 },
  { line: 'Line 4', cutting: 78, sewing: 82, finishing: 80 },
  { line: 'Line 5', cutting: 90, sewing: 87, finishing: 90 },
];

// Roster & Profiles Data
const workersData = [
  {
    id: 1,
    workerId: 'WKR-1024',
    name: 'Sarah Ahmed',
    department: 'Production',
    role: 'Operator',
    skillLevel: 92,
    line: 'Line 1',
    status: 'Active',
  },
  {
    id: 2,
    workerId: 'WKR-1025',
    name: 'Mohammed Khan',
    department: 'Cutting',
    role: 'Supervisor',
    skillLevel: 88,
    line: 'Line 2',
    status: 'Active',
  },
  {
    id: 3,
    workerId: 'WKR-1026',
    name: 'Fatima Hassan',
    department: 'Finishing',
    role: 'Operator',
    skillLevel: 85,
    line: 'Line 3',
    status: 'On Leave',
  },
  {
    id: 4,
    workerId: 'WKR-1027',
    name: 'Ali Reza',
    department: 'Production',
    role: 'Operator',
    skillLevel: 78,
    line: 'Line 4',
    status: 'Active',
  },
  {
    id: 5,
    workerId: 'WKR-1028',
    name: 'Amina Begum',
    department: 'Quality Control',
    role: 'Quality Inspector',
    skillLevel: 90,
    line: 'Line 1',
    status: 'Active',
  },
  {
    id: 6,
    workerId: 'WKR-1029',
    name: 'Hassan Ali',
    department: 'Maintenance',
    role: 'Technician',
    skillLevel: 87,
    line: 'Line 5',
    status: 'Active',
  },
  {
    id: 7,
    workerId: 'WKR-1030',
    name: 'Zainab Malik',
    department: 'Packing',
    role: 'Line Manager',
    skillLevel: 94,
    line: 'Line 6',
    status: 'Active',
  },
  {
    id: 8,
    workerId: 'WKR-1031',
    name: 'Ahmed Hussain',
    department: 'Production',
    role: 'Helper',
    skillLevel: 72,
    line: 'Line 2',
    status: 'Active',
  },
];

const assignmentsData = [
  {
    id: 1,
    line: 'Line 1',
    shift: 'Day Shift',
    workers: 45,
    capacity: 50,
    efficiency: 92,
  },
  {
    id: 2,
    line: 'Line 2',
    shift: 'Day Shift',
    workers: 48,
    capacity: 50,
    efficiency: 88,
  },
  {
    id: 3,
    line: 'Line 3',
    shift: 'Night Shift',
    workers: 42,
    capacity: 50,
    efficiency: 85,
  },
  {
    id: 4,
    line: 'Line 4',
    shift: 'Day Shift',
    workers: 38,
    capacity: 50,
    efficiency: 78,
  },
];

const attendanceRecordsData = [
  {
    id: 1,
    workerId: 'WKR-1024',
    name: 'Sarah Ahmed',
    date: '2024-10-26',
    checkIn: '08:02',
    checkOut: '17:05',
    status: 'Present',
  },
  {
    id: 2,
    workerId: 'WKR-1025',
    name: 'Mohammed Khan',
    date: '2024-10-26',
    checkIn: '08:15',
    checkOut: '17:10',
    status: 'Present',
  },
  {
    id: 3,
    workerId: 'WKR-1026',
    name: 'Fatima Hassan',
    date: '2024-10-26',
    checkIn: '-',
    checkOut: '-',
    status: 'Absent',
  },
  {
    id: 4,
    workerId: 'WKR-1027',
    name: 'Ali Reza',
    date: '2024-10-26',
    checkIn: '08:05',
    checkOut: '-',
    status: 'Late',
  },
];

// Attendance & Leave Data
const dailyAttendanceData = [
  {
    id: 1,
    line: 'Line 1',
    present: 45,
    absent: 3,
    late: 2,
    total: 50,
  },
  {
    id: 2,
    line: 'Line 2',
    present: 48,
    absent: 1,
    late: 1,
    total: 50,
  },
  {
    id: 3,
    line: 'Line 3',
    present: 42,
    absent: 6,
    late: 2,
    total: 50,
  },
  {
    id: 4,
    line: 'Line 4',
    present: 38,
    absent: 8,
    late: 4,
    total: 50,
  },
];

const leaveRequestsData = [
  {
    id: 1,
    workerId: 'WKR-1026',
    name: 'Fatima Hassan',
    leaveType: 'Sick Leave',
    fromDate: '2024-10-26',
    toDate: '2024-10-27',
    status: 'Pending',
  },
  {
    id: 2,
    workerId: 'WKR-1032',
    name: 'Nadia Ali',
    leaveType: 'Annual Leave',
    fromDate: '2024-10-28',
    toDate: '2024-10-30',
    status: 'Approved',
  },
  {
    id: 3,
    workerId: 'WKR-1045',
    name: 'Ahmed Malik',
    leaveType: 'Emergency Leave',
    fromDate: '2024-10-27',
    toDate: '2024-10-27',
    status: 'Pending',
  },
];

const shiftPlanningData = [
  {
    id: 1,
    shift: 'Day Shift A',
    time: '08:00 - 17:00',
    workers: 180,
    lines: '1, 2, 3, 4',
  },
  {
    id: 2,
    shift: 'Day Shift B',
    time: '09:00 - 18:00',
    workers: 85,
    lines: '5, 6',
  },
  {
    id: 3,
    shift: 'Night Shift',
    time: '20:00 - 05:00',
    workers: 50,
    lines: '3',
  },
];

// Skill Matrix Data
const operationsSkillsData = [
  {
    id: 1,
    operation: 'Sewing',
    workerCount: 120,
    avgSkill: 88,
    gap: 12,
  },
  {
    id: 2,
    operation: 'Cutting',
    workerCount: 35,
    avgSkill: 90,
    gap: 10,
  },
  {
    id: 3,
    operation: 'Finishing',
    workerCount: 45,
    avgSkill: 85,
    gap: 15,
  },
  {
    id: 4,
    operation: 'Quality Control',
    workerCount: 25,
    avgSkill: 92,
    gap: 8,
  },
  {
    id: 5,
    operation: 'Bartack',
    workerCount: 18,
    avgSkill: 78,
    gap: 22,
  },
];

const lineSkillsData = [
  {
    id: 1,
    line: 'Line 1',
    workers: 50,
    avgSkill: 88,
    weakOperations: 'None',
  },
  {
    id: 2,
    line: 'Line 2',
    workers: 50,
    avgSkill: 89,
    weakOperations: 'Buttonhole',
  },
  {
    id: 3,
    line: 'Line 3',
    workers: 50,
    avgSkill: 86,
    weakOperations: 'Overlock',
  },
  {
    id: 4,
    line: 'Line 4',
    workers: 50,
    avgSkill: 80,
    weakOperations: 'Bartack, Finishing',
  },
  {
    id: 5,
    line: 'Line 5',
    workers: 50,
    avgSkill: 89,
    weakOperations: 'None',
  },
];

const workerSkillsData = [
  {
    id: 1,
    workerId: 'WKR-1024',
    name: 'Sarah Ahmed',
    primarySkill: 'Sewing',
    skillScore: 92,
    certifications: 'Overlock, Flatlock',
  },
  {
    id: 2,
    workerId: 'WKR-1025',
    name: 'Mohammed Khan',
    primarySkill: 'Cutting',
    skillScore: 88,
    certifications: 'Fabric Spreading',
  },
  {
    id: 3,
    workerId: 'WKR-1027',
    name: 'Ali Reza',
    primarySkill: 'Sewing',
    skillScore: 78,
    certifications: 'Basic Sewing',
  },
];

// Training & Assessments Data
const trainingCalendarData = [
  {
    id: 1,
    trainingId: 'TRN-2024-1012',
    course: 'Overlock Operation Refresher',
    date: '2024-10-28',
    participants: 12,
    status: 'Scheduled',
  },
  {
    id: 2,
    trainingId: 'TRN-2024-1013',
    course: 'Lean 5S Workshop',
    date: '2024-10-30',
    participants: 25,
    status: 'Scheduled',
  },
  {
    id: 3,
    trainingId: 'TRN-2024-1014',
    course: 'Fire Safety Drill',
    date: '2024-11-02',
    participants: 320,
    status: 'Scheduled',
  },
];

const coursesData = [
  {
    id: 1,
    courseId: 'CRS-101',
    courseName: 'Basic Sewing Techniques',
    duration: '2 days',
    category: 'Technical',
    enrollments: 35,
  },
  {
    id: 2,
    courseId: 'CRS-102',
    courseName: 'Advanced Overlock',
    duration: '3 days',
    category: 'Technical',
    enrollments: 18,
  },
  {
    id: 3,
    courseId: 'CRS-201',
    courseName: 'Workplace Safety',
    duration: '1 day',
    category: 'Safety',
    enrollments: 120,
  },
  {
    id: 4,
    courseId: 'CRS-301',
    courseName: 'Quality Standards',
    duration: '2 days',
    category: 'Quality',
    enrollments: 45,
  },
];

const assessmentsData = [
  {
    id: 1,
    workerId: 'WKR-1027',
    name: 'Ali Reza',
    course: 'Basic Sewing',
    preScore: 65,
    postScore: 82,
    improvement: 17,
  },
  {
    id: 2,
    workerId: 'WKR-1048',
    name: 'Zainab Syed',
    course: 'Overlock Refresher',
    preScore: 72,
    postScore: 88,
    improvement: 16,
  },
  {
    id: 3,
    workerId: 'WKR-1055',
    name: 'Bilal Ahmed',
    course: 'Quality Standards',
    preScore: 78,
    postScore: 90,
    improvement: 12,
  },
];

// Welfare & Safety Data
const welfareData = [
  {
    id: 1,
    category: 'Canteen Services',
    satisfaction: 88,
    feedback: 'Positive',
    participants: 280,
  },
  {
    id: 2,
    category: 'Transportation',
    satisfaction: 82,
    feedback: 'Mixed',
    participants: 195,
  },
  {
    id: 3,
    category: 'Health Services',
    satisfaction: 92,
    feedback: 'Positive',
    participants: 320,
  },
  {
    id: 4,
    category: 'Workplace Environment',
    satisfaction: 85,
    feedback: 'Positive',
    participants: 320,
  },
];

const safetyAuditsData = [
  {
    id: 1,
    auditId: 'AUD-2024-0824',
    area: 'Cutting Section',
    date: '2024-10-22',
    score: 92,
    status: 'Passed',
  },
  {
    id: 2,
    auditId: 'AUD-2024-0825',
    area: 'Sewing Floor',
    date: '2024-10-23',
    score: 88,
    status: 'Passed',
  },
  {
    id: 3,
    auditId: 'AUD-2024-0826',
    area: 'Finishing Department',
    date: '2024-10-24',
    score: 85,
    status: 'Passed',
  },
];

const incidentsData = [
  {
    id: 1,
    incidentId: 'INC-2024-0152',
    date: '2024-10-24',
    location: 'Pressing Section',
    type: 'Near-miss',
    severity: 'Low',
    capaId: 'CAPA-1024',
  },
  {
    id: 2,
    incidentId: 'INC-2024-0153',
    date: '2024-10-25',
    location: 'Cutting Floor',
    type: 'Minor Injury',
    severity: 'Medium',
    capaId: 'CAPA-1025',
  },
];

interface WorkforceManagementProps {
  initialSubPage?: string;
  onAskMarbim?: (prompt: string) => void;
}

export function WorkforceManagement({ initialSubPage = 'dashboard', onAskMarbim }: WorkforceManagementProps) {
  const routeSubpage = useRouteSubpage('dashboard', initialSubPage);
  const [currentView, setCurrentView] = useState<string>(routeSubpage);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workerDrawerOpen, setWorkerDrawerOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [addWorkerDrawerOpen, setAddWorkerDrawerOpen] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isModuleSetup, setIsModuleSetup] = useState(false);
  
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    setCurrentView(routeSubpage);
  }, [routeSubpage]);

  // Filtered workers data
  const filteredWorkersData = workersData.filter((worker) => {
    const matchesDepartment = departmentFilter === 'all' || worker.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || worker.role === roleFilter;
    return matchesDepartment && matchesRole;
  });

  // Handle worker added
  const handleWorkerAdded = () => {
    // Refresh data or update state as needed
    toast.success('Worker successfully added to the database!');
  };

  // Workers Columns
  const workersColumns: Column[] = [
    { key: 'workerId', label: 'Worker ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    {
      key: 'skillLevel',
      label: 'Skill Level',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 70 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'line', label: 'Line' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Active': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'On Leave': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Resigned': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Assignments Columns
  const assignmentsColumns: Column[] = [
    { key: 'line', label: 'Line', sortable: true },
    { key: 'shift', label: 'Shift' },
    {
      key: 'workers',
      label: 'Workers',
      sortable: true,
      render: (value, row) => `${value}/${row.capacity}`,
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 75 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
  ];

  // Attendance Records Columns
  const attendanceRecordsColumns: Column[] = [
    { key: 'workerId', label: 'Worker ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Present': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Absent': 'bg-[#D0342C]/10 text-[#D0342C]',
          'Late': 'bg-[#EAB308]/10 text-[#EAB308]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Daily Attendance Columns
  const dailyAttendanceColumns: Column[] = [
    { key: 'line', label: 'Line', sortable: true },
    {
      key: 'present',
      label: 'Present',
      sortable: true,
      render: (value) => <span className="text-[#57ACAF]">{value}</span>,
    },
    {
      key: 'absent',
      label: 'Absent',
      sortable: true,
      render: (value) => <span className="text-[#D0342C]">{value}</span>,
    },
    {
      key: 'late',
      label: 'Late',
      sortable: true,
      render: (value) => <span className="text-[#EAB308]">{value}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (value) => <span className="text-white">{value}</span>,
    },
  ];

  // Leave Requests Columns
  const leaveRequestsColumns: Column[] = [
    { key: 'workerId', label: 'Worker ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'fromDate', label: 'From Date', sortable: true },
    { key: 'toDate', label: 'To Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Pending': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Approved': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Rejected': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Shift Planning Columns
  const shiftPlanningColumns: Column[] = [
    { key: 'shift', label: 'Shift', sortable: true },
    { key: 'time', label: 'Time' },
    {
      key: 'workers',
      label: 'Workers',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    { key: 'lines', label: 'Lines' },
  ];

  // Operations Skills Columns
  const operationsSkillsColumns: Column[] = [
    { key: 'operation', label: 'Operation', sortable: true },
    {
      key: 'workerCount',
      label: 'Worker Count',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'avgSkill',
      label: 'Avg Skill %',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 75 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'gap',
      label: 'Gap %',
      sortable: true,
      render: (value) => {
        const color = value <= 10 ? 'text-[#57ACAF]' : value <= 15 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
  ];

  // Line Skills Columns
  const lineSkillsColumns: Column[] = [
    { key: 'line', label: 'Line', sortable: true },
    {
      key: 'workers',
      label: 'Workers',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'avgSkill',
      label: 'Avg Skill %',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 75 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'weakOperations', label: 'Weak Operations' },
  ];

  // Worker Skills Columns
  const workerSkillsColumns: Column[] = [
    { key: 'workerId', label: 'Worker ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'primarySkill', label: 'Primary Skill' },
    {
      key: 'skillScore',
      label: 'Skill Score',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 70 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    { key: 'certifications', label: 'Certifications' },
  ];

  // Training Calendar Columns
  const trainingCalendarColumns: Column[] = [
    { key: 'trainingId', label: 'Training ID', sortable: true },
    { key: 'course', label: 'Course' },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'participants',
      label: 'Participants',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Scheduled': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Completed': 'bg-[#6F83A7]/10 text-[#6F83A7]',
          'Cancelled': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Courses Columns
  const coursesColumns: Column[] = [
    { key: 'courseId', label: 'Course ID', sortable: true },
    { key: 'courseName', label: 'Course Name', sortable: true },
    { key: 'duration', label: 'Duration' },
    { key: 'category', label: 'Category' },
    {
      key: 'enrollments',
      label: 'Enrollments',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
  ];

  // Assessments Columns
  const assessmentsColumns: Column[] = [
    { key: 'workerId', label: 'Worker ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'course', label: 'Course' },
    {
      key: 'preScore',
      label: 'Pre-Score',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'postScore',
      label: 'Post-Score',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'improvement',
      label: 'Improvement',
      sortable: true,
      render: (value) => <span className="text-[#57ACAF]">+{value}%</span>,
    },
  ];

  // Welfare Columns
  const welfareColumns: Column[] = [
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'satisfaction',
      label: 'Satisfaction %',
      sortable: true,
      render: (value) => {
        const color = value >= 85 ? 'text-[#57ACAF]' : value >= 75 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (value) => {
        const colors: any = {
          'Positive': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Mixed': 'bg-[#EAB308]/10 text-[#EAB308]',
          'Negative': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    {
      key: 'participants',
      label: 'Participants',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
  ];

  // Safety Audits Columns
  const safetyAuditsColumns: Column[] = [
    { key: 'auditId', label: 'Audit ID', sortable: true },
    { key: 'area', label: 'Area' },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'score',
      label: 'Score',
      sortable: true,
      render: (value) => {
        const color = value >= 90 ? 'text-[#57ACAF]' : value >= 80 ? 'text-[#EAB308]' : 'text-[#D0342C]';
        return <span className={color}>{value}%</span>;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors: any = {
          'Passed': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Failed': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
  ];

  // Incidents Columns
  const incidentsColumns: Column[] = [
    { key: 'incidentId', label: 'Incident ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => {
        const colors: any = {
          'Low': 'bg-[#57ACAF]/10 text-[#57ACAF]',
          'Medium': 'bg-[#EAB308]/10 text-[#EAB308]',
          'High': 'bg-[#D0342C]/10 text-[#D0342C]',
        };
        return <Badge className={colors[value]}>{value}</Badge>;
      },
    },
    { key: 'capaId', label: 'CAPA ID' },
  ];

  const handleRowClick = (record: any) => {
    // Check if it's a worker record (from All Workers tab)
    if (record.workerId && currentView === 'roster-profiles') {
      setSelectedWorker(record);
      setWorkerDrawerOpen(true);
    } else {
      setSelectedRecord(record);
      setDrawerOpen(true);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Hero Banner with Executive Summary */}
      <div className="bg-gradient-to-br from-[#57ACAF]/10 via-[#EAB308]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/30">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl mb-2">Workforce Intelligence Hub</h2>
                <p className="text-[#6F83A7] text-sm max-w-2xl">
                  Real-time visibility into workforce performance, attendance patterns, skill development, and resource optimization. 
                  Track productivity metrics, identify training needs, and leverage AI insights for strategic workforce planning.
                </p>
              </div>
            </div>
            <MarbimAIButton
              marbimPrompt="Provide a comprehensive executive summary of workforce operations including: 1) Overall workforce health and productivity metrics (94.5% attendance, 86% skill coverage), 2) Critical staffing issues requiring immediate attention (Line 4 attendance concerns, 8 skill gaps), 3) Workforce optimization opportunities and efficiency improvements, 4) Training completion trends and skill development priorities, 5) Attrition risk factors and retention strategies, 6) Resource allocation analysis across production lines, 7) Forecast for next month based on current trends, seasonal patterns, and upcoming production schedules."
              onAskMarbim={onAskMarbim}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Total Workforce</span>
              </div>
              <div className="text-2xl text-white mb-1">320</div>
              <div className="text-xs text-[#57ACAF]">+5 this month</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Attendance Rate</span>
              </div>
              <div className="text-2xl text-white mb-1">94.5%</div>
              <div className="text-xs text-[#57ACAF]">+2.3% vs last week</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[#57ACAF]" />
                <span className="text-xs text-[#6F83A7]">Skill Coverage</span>
              </div>
              <div className="text-2xl text-white mb-1">86%</div>
              <div className="text-xs text-[#57ACAF]">+4.2% improvement</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs text-[#6F83A7]">Overtime Hours</span>
              </div>
              <div className="text-2xl text-white mb-1">1,245h</div>
              <div className="text-xs text-[#57ACAF]">-8.5% reduction</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#D0342C]" />
                <span className="text-xs text-[#6F83A7]">Skill Gaps</span>
              </div>
              <div className="text-2xl text-white mb-1">8</div>
              <div className="text-xs text-[#D0342C]">Needs attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <KPICard
          title="Attendance Rate"
          value="94.5%"
          change={2.3}
          changeLabel="vs last week"
          icon={UserCheck}
          trend="up"
        />
        <KPICard
          title="Total Workforce"
          value="320"
          change={3.2}
          changeLabel="new hires"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Overtime Hours"
          value="1,245h"
          change={-8.5}
          changeLabel="reduction"
          icon={Clock}
          trend="up"
        />
        <KPICard
          title="Skill Coverage"
          value="86%"
          change={4.2}
          changeLabel="improvement"
          icon={Award}
          trend="up"
        />
        <KPICard
          title="Attrition Rate"
          value="2.3%"
          change={-15.8}
          changeLabel="reduction"
          icon={TrendingDown}
          trend="up"
        />
        <KPICard
          title="Training Completion"
          value="87%"
          change={12.5}
          icon={BookOpen}
          trend="up"
        />
      </div>

      {/* Workforce Distribution by Department */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#57ACAF]" />
              Workforce Distribution by Department
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Headcount allocation across key departments with productivity and skill level indicators
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze workforce distribution across departments. Provide: 1) Departments with resource imbalances or bottlenecks, 2) Optimal headcount allocation based on production demands, 3) Cross-departmental mobility opportunities, 4) Department-specific skill gaps and training needs, 5) Recommendations for workforce rebalancing to improve overall efficiency."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dashboardSummary.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => toast.info(`Viewing ${item.label} details`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>
                  <div className="text-4xl" style={{ color: item.color }}>{item.value}</div>
                </div>
                <div className="text-[#6F83A7] mb-3">{item.label}</div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6F83A7]">View Details</span>
                    <ChevronRight className="w-4 h-4 text-[#6F83A7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attendance Trends and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Attendance Trends Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#57ACAF]" />
                Attendance Trends (Last 7 Days)
              </h3>
              <p className="text-sm text-[#6F83A7]">Daily attendance tracking with target benchmarks and trend analysis</p>
            </div>
            <div className="flex gap-2">
              <MarbimAIButton
                marbimPrompt="Analyze attendance trends over the past week. Identify: 1) Days with lowest attendance and potential causes (weather, cultural events, etc.), 2) Patterns suggesting systematic issues (specific lines, shifts, or days of week), 3) Forecast for next week's attendance based on historical patterns, 4) Impact on production schedules and order fulfillment, 5) Recommended contingency planning and backup staffing strategies."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
              <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsLine data={attendanceTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
              <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[90, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#ffffff' }}
                formatter={(value: any) => `${value}%`}
              />
              <Line type="monotone" dataKey="attendance" stroke="#57ACAF" strokeWidth={3} name="Attendance %" dot={{ fill: '#57ACAF', r: 4 }} />
              <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            </RechartsLine>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <AICard
            title="MARBIM Workforce Insights"
            marbimPrompt="Provide comprehensive workforce insights including: 1) Absenteeism predictions and preventive measures, 2) Optimal operator reassignments across lines for efficiency, 3) Critical skill gaps requiring immediate training, 4) Overtime reduction strategies, 5) Worker satisfaction and retention recommendations."
            onAskMarbim={onAskMarbim}
          >
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white mb-1">Attendance Alert</p>
                    <p className="text-sm text-[#6F83A7]">
                      Line 4 showing 12% increase in absences. Predicted staffing shortage on Oct 28.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3 mb-2">
                  <Target className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white mb-1">Optimization Opportunity</p>
                    <p className="text-sm text-[#6F83A7]">
                      Reassign 5 operators from Line 1 to Line 4 to balance efficiency and meet deadlines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white mb-1">Training Priority</p>
                    <p className="text-sm text-[#6F83A7]">
                      22% skill gap in Bartack operations. Schedule urgent training for 18 operators.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex items-start gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white mb-1">Efficiency Forecast</p>
                    <p className="text-sm text-[#6F83A7]">
                      Implementing recommendations could improve overall efficiency to 91% by next month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AICard>
        </div>
      </div>

      {/* Skill Coverage by Line */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#57ACAF]" />
              Skill Coverage by Production Line
            </h3>
            <p className="text-sm text-[#6F83A7]">
              Multi-skill capability across different operations per line - percentage of workers proficient in each operation
            </p>
          </div>
          <MarbimAIButton
            marbimPrompt="Analyze skill coverage across production lines. Provide: 1) Lines with critical skill deficiencies that could impact production, 2) Cross-training opportunities to improve coverage and flexibility, 3) Impact of current skill gaps on production capacity and order fulfillment, 4) Recommended skill development programs with prioritization, 5) Timeline and action plan for achieving 90%+ coverage across all lines."
            onAskMarbim={onAskMarbim}
            size="sm"
          />
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={skillCoverageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis dataKey="line" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
            <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D1117',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              labelStyle={{ color: '#ffffff' }}
              formatter={(value: any) => `${value}%`}
            />
            <Bar dataKey="cutting" fill="#57ACAF" name="Cutting" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sewing" fill="#EAB308" name="Sewing" radius={[4, 4, 0, 0]} />
            <Bar dataKey="finishing" fill="#6F83A7" name="Finishing" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderRosterProfiles = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Roster & Profiles</h2>
          <p className="text-sm text-[#6F83A7]">Central database of all employees and assignments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-[rgb(255,255,255)]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setAddWorkerDrawerOpen(true)}
            className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Worker
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-workers" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="all-workers" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">All Workers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Briefcase className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Assignments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <UserCheck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Attendance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all-workers" className="space-y-6">
          {/* Workers Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-2xl text-white">320</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Total Workers</div>
              <div className="text-xs text-[#57ACAF] mt-1">+5 this month</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-2xl text-white">245</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Skilled Workers</div>
              <div className="text-xs text-[#EAB308] mt-1">76.5% of workforce</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-2xl text-white">18</div>
              </div>
              <div className="text-sm text-[#6F83A7]">New Hires (30d)</div>
              <div className="text-xs text-[#57ACAF] mt-1">Onboarding active</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-2xl text-white">7</div>
              </div>
              <div className="text-sm text-[#6F83A7]">At-Risk Workers</div>
              <div className="text-xs text-[#D0342C] mt-1">Requires attention</div>
            </div>
          </div>

          {/* Workers Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#57ACAF]" />
                  Worker Database
                </h3>
                <p className="text-sm text-[#6F83A7]">
                  Complete roster with skills, assignments, and performance metrics
                </p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze the complete worker database. Provide: 1) Workforce composition by skill level and department, 2) Workers with high performance potential for advancement, 3) Skill distribution gaps across production lines, 4) Workers at risk of attrition based on attendance and performance, 5) Recommendations for cross-training and skill development programs, 6) Optimal workforce structure for current production demands."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>

            {/* Filtering Section */}
            <div className="mb-6 p-4 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#57ACAF]" />
                  <span className="text-sm text-white">Filter Workers</span>
                </div>
                {(departmentFilter !== 'all' || roleFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDepartmentFilter('all');
                      setRoleFilter('all');
                    }}
                    className="text-xs text-[#6F83A7] hover:text-white"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#6F83A7]">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF]"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>All Departments</option>
                    <option value="Production" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Production</option>
                    <option value="Quality Control" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Quality Control</option>
                    <option value="Finishing" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Finishing</option>
                    <option value="Cutting" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Cutting</option>
                    <option value="Packing" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Packing</option>
                    <option value="Maintenance" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-[#6F83A7]">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#57ACAF]/50 focus:border-[#57ACAF]"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="all" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>All Roles</option>
                    <option value="Operator" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Operator</option>
                    <option value="Supervisor" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Supervisor</option>
                    <option value="Quality Inspector" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Quality Inspector</option>
                    <option value="Technician" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Technician</option>
                    <option value="Line Manager" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Line Manager</option>
                    <option value="Helper" style={{ backgroundColor: '#1a1f2e', color: '#ffffff' }}>Helper</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#6F83A7]">
                <Info className="w-3.5 h-3.5" />
                <span>
                  Showing {filteredWorkersData.length} of {workersData.length} workers
                </span>
              </div>
            </div>

            <SmartTable
              columns={workersColumns}
              data={filteredWorkersData}
              searchPlaceholder="Search workers by name, ID, skill..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* Worker Skills Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#57ACAF]" />
                    Skills Distribution
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Worker skill coverage across operations</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze skills distribution across the workforce. Identify: 1) Most critical skill gaps, 2) Opportunities for upskilling workers with adjacent skills, 3) Cross-training recommendations to improve flexibility, 4) High-skill workers suitable for mentoring roles."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { skill: 'Sewing', workers: 145, capacity: 180 },
                  { skill: 'Cutting', workers: 85, capacity: 100 },
                  { skill: 'Finishing', workers: 95, capacity: 120 },
                  { skill: 'QC', workers: 42, capacity: 50 },
                  { skill: 'Packing', workers: 58, capacity: 70 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="skill" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="workers" fill="#57ACAF" name="Current Workers" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" fill="#6F83A7" name="Capacity" radius={[4, 4, 0, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                    Performance Categories
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Worker performance distribution</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze worker performance distribution. Provide: 1) Characteristics of top performers for hiring benchmarks, 2) Support strategies for underperforming workers, 3) Performance improvement trends and training effectiveness, 4) Recommendations for performance-based incentive programs."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: 'Excellent (90%+)', value: 112, color: '#57ACAF' },
                      { name: 'Good (75-89%)', value: 145, color: '#EAB308' },
                      { name: 'Average (60-74%)', value: 48, color: '#6F83A7' },
                      { name: 'Needs Improvement', value: 15, color: '#D0342C' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {[
                      { color: '#57ACAF' },
                      { color: '#EAB308' },
                      { color: '#6F83A7' },
                      { color: '#D0342C' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Assignment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-2xl text-white">12</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Production Lines</div>
              <div className="text-xs text-[#57ACAF] mt-1">All active</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-2xl text-white">88%</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Avg Line Efficiency</div>
              <div className="text-xs text-[#57ACAF] mt-1">+3.2% vs target</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-2xl text-white">26.7</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Avg Workers/Line</div>
              <div className="text-xs text-[#6F83A7] mt-1">Optimal range</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-2xl text-white">5</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Pending Reassignments</div>
              <div className="text-xs text-[#EAB308] mt-1">Optimization needed</div>
            </div>
          </div>

          {/* Line Assignments Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#57ACAF]" />
                  Production Line Assignments
                </h3>
                <p className="text-sm text-[#6F83A7]">
                  Worker allocation across production lines with skill coverage and efficiency metrics
                </p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze production line assignments. Provide: 1) Lines with suboptimal worker allocation or skill gaps, 2) Recommended worker reassignments to balance efficiency across all lines, 3) Impact of proposed changes on production capacity, 4) Workers who could be cross-trained to provide coverage flexibility, 5) Optimal line staffing levels based on current and upcoming orders, 6) Potential bottlenecks from current assignments."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <SmartTable
              columns={assignmentsColumns}
              data={assignmentsData}
              searchPlaceholder="Search by line, worker, or product..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* AI Assignment Optimization */}
          <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-[#57ACAF]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2 flex items-center gap-2">
                    AI Assignment Optimization Recommendations
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Line 6:</span> Reassign Worker A (Employee #145, 90% sewing proficiency) from Line 1 to close critical sewing gap and improve efficiency from 82% to 89%.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Line 4:</span> Move Worker B (Employee #087, finishing specialist) to balance finishing capacity and reduce overtime by 15%.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#57ACAF] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Line 2:</span> Cross-train 3 workers in cutting operations to achieve 95% skill coverage and improve line flexibility.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#57ACAF]" />
                        <span>Projected efficiency gain: <span className="text-[#57ACAF]">+5.2%</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#EAB308]" />
                        <span>Overtime reduction: <span className="text-[#EAB308]">-18%</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Generate comprehensive assignment optimization strategy including: 1) Detailed worker-to-line reassignment plan with skill matching, 2) Step-by-step implementation timeline to minimize disruption, 3) Expected efficiency improvements and cost savings, 4) Risk mitigation for workers transitioning to new lines, 5) Cross-training schedule to improve long-term flexibility, 6) Performance monitoring plan to measure optimization success."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>

          {/* Line Efficiency Comparison */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                  Line Efficiency Comparison
                </h3>
                <p className="text-sm text-[#6F83A7]">Current efficiency vs target across all production lines</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze line efficiency gaps. Identify: 1) Root causes of underperformance in low-efficiency lines, 2) Best practices from high-performing lines that can be replicated, 3) Staffing or equipment issues affecting efficiency, 4) Action plan to bring all lines to 90%+ efficiency."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={[
                { line: 'Line 1', efficiency: 92, target: 90 },
                { line: 'Line 2', efficiency: 88, target: 90 },
                { line: 'Line 3', efficiency: 85, target: 90 },
                { line: 'Line 4', efficiency: 82, target: 90 },
                { line: 'Line 5', efficiency: 90, target: 90 },
                { line: 'Line 6', efficiency: 78, target: 90 },
                { line: 'Line 7', efficiency: 91, target: 90 },
                { line: 'Line 8', efficiency: 87, target: 90 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="line" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1117',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                  labelStyle={{ color: '#ffffff' }}
                  formatter={(value: any) => `${value}%`}
                />
                <Bar dataKey="efficiency" fill="#57ACAF" name="Current Efficiency" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#EAB308" name="Target" radius={[4, 4, 0, 0]} opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          {/* Attendance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#57ACAF]" />
                </div>
                <div className="text-2xl text-white">94.5%</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Today's Attendance</div>
              <div className="text-xs text-[#57ACAF] mt-1">+2.3% vs avg</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-2xl text-white">302</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Present Today</div>
              <div className="text-xs text-[#6F83A7] mt-1">Out of 320 total</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="text-2xl text-white">18</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Absent Today</div>
              <div className="text-xs text-[#D0342C] mt-1">5.5% absence rate</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#6F83A7]" />
                </div>
                <div className="text-2xl text-white">12</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Late Arrivals</div>
              <div className="text-xs text-[#6F83A7] mt-1">Within tolerance</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="text-2xl text-white">5</div>
              </div>
              <div className="text-sm text-[#6F83A7]">Absence Streaks</div>
              <div className="text-xs text-[#EAB308] mt-1">Requires review</div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#57ACAF]" />
                  Attendance Records
                </h3>
                <p className="text-sm text-[#6F83A7]">
                  Daily attendance tracking with status, time in/out, and pattern analysis
                </p>
              </div>
              <div className="flex gap-2">
                <MarbimAIButton
                  marbimPrompt="Analyze attendance records comprehensively. Provide: 1) Workers with concerning absence patterns (frequent, extended, or Monday/Friday clustering), 2) Departments or lines with higher-than-average absenteeism, 3) Correlation between attendance and production efficiency, 4) Prediction of staffing shortages for the next week, 5) Recommended interventions for workers with poor attendance, 6) Impact of attendance issues on order fulfillment and overtime costs."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
                <Button variant="outline" size="sm" className="text-[#6F83A7] border-white/10 bg-transparent hover:bg-white/5">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <SmartTable
              columns={attendanceRecordsColumns}
              data={attendanceRecordsData}
              searchPlaceholder="Search by worker, date, or status..."
              onRowClick={handleRowClick}
            />
          </div>

          {/* Attendance Alert */}
          <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#D0342C]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white mb-2">Critical Attendance Alerts</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D0342C] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Worker #204 (Sarah Khan):</span> 3-day consecutive absence detected. No leave request on file. Possible attrition risk — immediate manager follow-up recommended.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D0342C] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Line 4:</span> 5 workers absent today (18% absence rate). Production capacity reduced to 82%. Consider temporary reassignments from Line 1.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D0342C] mt-2" />
                      <p className="text-sm text-[#6F83A7]">
                        <span className="text-white">Pattern Alert:</span> Monday absenteeism 12% higher than weekly average. Investigate potential scheduling or motivation issues.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-[#6F83A7]">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#D0342C]" />
                        <span>High-risk workers: <span className="text-[#D0342C]">7</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4 text-[#EAB308]" />
                        <span>Weekly attendance trend: <span className="text-[#EAB308]">-1.8%</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Provide detailed attendance intervention strategy including: 1) Immediate actions for workers with 3+ day absence streaks, 2) Manager communication scripts for attendance discussions, 3) Root cause analysis of high absenteeism (health, transportation, motivation), 4) Retention programs for at-risk workers, 5) Staffing contingency plans to maintain production despite absences, 6) Long-term attendance improvement initiatives and incentive programs."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#57ACAF]" />
                    Weekly Attendance Trend
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Last 7 days attendance rate</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze weekly attendance patterns. Identify: 1) Days with lowest attendance and potential causes, 2) Correlation with production schedules or external factors, 3) Forecast for next week based on historical patterns."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RechartsLine data={attendanceTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[90, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#ffffff' }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Line type="monotone" dataKey="attendance" stroke="#57ACAF" strokeWidth={3} name="Attendance" dot={{ fill: '#57ACAF', r: 5 }} />
                  <Line type="monotone" dataKey="target" stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" name="Target (95%)" />
                </RechartsLine>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#57ACAF]" />
                    Absence Reasons
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Breakdown of absence causes</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze absence reasons. Provide: 1) Most common causes requiring intervention, 2) Trends suggesting systemic workplace issues, 3) Recommendations for reducing preventable absences."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={[
                  { reason: 'Sick Leave', count: 45 },
                  { reason: 'Unauthorized', count: 18 },
                  { reason: 'Personal', count: 12 },
                  { reason: 'Family Emergency', count: 8 },
                  { reason: 'Transport', count: 5 },
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <YAxis dataKey="reason" type="category" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="count" fill="#57ACAF" name="Occurrences" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* AI Insights Header */}
          <div className="bg-gradient-to-br from-[#EAB308]/10 via-[#57ACAF]/5 to-[#6F83A7]/10 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(87,172,175,0.1),transparent_50%)]" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/60 flex items-center justify-center shadow-lg shadow-[#EAB308]/30">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl mb-2">AI-Powered Workforce Intelligence</h3>
                    <p className="text-sm text-[#6F83A7] max-w-2xl">
                      Comprehensive AI analysis of workforce patterns, performance trends, and optimization opportunities. 
                      Get predictive insights for staffing, retention, and productivity improvements.
                    </p>
                  </div>
                </div>
                <MarbimAIButton
                  marbimPrompt="Provide comprehensive AI workforce intelligence summary including: 1) Critical staffing issues and immediate actions required, 2) Worker performance trends and development opportunities, 3) Attrition risk assessment with retention strategies, 4) Optimal staffing and assignment recommendations, 5) Training priorities and skill development roadmap, 6) Efficiency improvement opportunities across all lines, 7) Long-term workforce planning recommendations based on production forecasts."
                  onAskMarbim={onAskMarbim}
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-[#D0342C]/5 border border-[#D0342C]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D0342C]/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-[#D0342C]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white mb-1">Critical Staffing Alert</h4>
                    <MarbimAIButton
                      marbimPrompt="Analyze Line 3 staffing shortage. Provide: 1) Immediate reassignment options from overstaffed lines, 2) Impact on production schedule if not resolved, 3) Temporary vs permanent staffing solutions, 4) Timeline for resolution."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Line 3 is short-staffed by 2 operators. Current capacity at 85%. Immediate reassignment recommended to maintain production schedule.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-[#D0342C] to-[#D0342C]/80 text-white hover:from-[#D0342C]/90 hover:to-[#D0342C]/70">
                    <Users className="w-4 h-4 mr-2" />
                    View Reassignment Options
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 text-[#EAB308]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white mb-1">Attrition Risk Warning</h4>
                    <MarbimAIButton
                      marbimPrompt="Analyze Worker #204 attrition risk. Provide: 1) Detailed attendance and performance history, 2) Likely reasons for declining engagement, 3) Retention intervention strategies, 4) Cost-benefit of retention vs replacement."
                      onAskMarbim={onAskMarbim}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-[#6F83A7] mb-4">
                    Worker ID #204 showing 15% decline in attendance over past month. Performance score dropped from 88% to 76%. High probability attrition risk.
                  </p>
                  <Button variant="outline" className="w-full border-[#EAB308]/30 text-[#EAB308] hover:bg-[#EAB308]/10">
                    <Target className="w-4 h-4 mr-2" />
                    View Retention Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Opportunities */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                  AI Optimization Opportunities
                </h3>
                <p className="text-sm text-[#6F83A7]">Ranked recommendations for workforce improvements</p>
              </div>
              <MarbimAIButton
                marbimPrompt="Generate detailed implementation plan for all optimization opportunities. Include: 1) Step-by-step execution roadmap, 2) Resource requirements and timeline, 3) Expected ROI and efficiency gains, 4) Risk mitigation strategies, 5) Success metrics and monitoring plan."
                onAskMarbim={onAskMarbim}
                size="sm"
              />
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl hover:border-[#57ACAF]/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm text-[#57ACAF]">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Cross-Training Program for Multi-Skill Coverage</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Train 45 workers in adjacent operations to achieve 90%+ skill coverage across all lines. 
                        Improves flexibility and reduces overtime dependency.
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-[#57ACAF]">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+12% efficiency</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>6-week program</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <Users className="w-3.5 h-3.5" />
                          <span>45 workers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Create detailed cross-training program plan including: 1) Worker selection criteria and prioritization, 2) Training curriculum and schedule, 3) Trainer assignments and mentorship pairings, 4) Progress tracking and certification process, 5) Cost analysis and budget requirements, 6) Expected impact on line efficiency and overtime."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl hover:border-[#EAB308]/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#EAB308]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm text-[#EAB308]">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Optimize Line Assignments for Balanced Efficiency</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Reassign 18 workers across lines based on skill profiles to balance efficiency from current 78-92% range to 88-92% across all lines.
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-[#EAB308]">
                          <BarChart3 className="w-3.5 h-3.5" />
                          <span>+8% avg efficiency</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Immediate</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <Users className="w-3.5 h-3.5" />
                          <span>18 reassignments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Generate optimal line assignment matrix. Provide: 1) Specific worker-to-line assignments with skill match scores, 2) Transition timeline to minimize production disruption, 3) Expected efficiency improvement per line, 4) Communication plan for affected workers, 5) Monitoring metrics to validate success."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#6F83A7]/10 to-[#6F83A7]/5 border border-[#6F83A7]/20 rounded-xl hover:border-[#6F83A7]/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-[#6F83A7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm text-[#6F83A7]">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-2">Implement Attendance Incentive Program</h4>
                      <p className="text-sm text-[#6F83A7] mb-3">
                        Launch performance-based attendance rewards to reduce current 5.5% absence rate to 3.5% target. 
                        Expected to reduce overtime costs by 20%.
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>-36% absenteeism</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>-20% overtime costs</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6F83A7]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>3-month rollout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <MarbimAIButton
                    marbimPrompt="Design comprehensive attendance incentive program including: 1) Reward structure and qualification criteria, 2) Budget and cost-benefit analysis, 3) Communication and rollout strategy, 4) Performance tracking dashboard, 5) Recognition and payout mechanisms, 6) Program evaluation metrics."
                    onAskMarbim={onAskMarbim}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#57ACAF]" />
                    Worker Performance Distribution
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Performance categories across workforce</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze performance distribution. Provide: 1) Characteristics of top performers, 2) Support strategies for underperformers, 3) Career development paths for high performers, 4) Training effectiveness analysis."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: 'Excellent (90%+)', value: 112, color: '#57ACAF' },
                      { name: 'Good (75-89%)', value: 145, color: '#EAB308' },
                      { name: 'Average (60-74%)', value: 48, color: '#6F83A7' },
                      { name: 'At Risk (<60%)', value: 15, color: '#D0342C' },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {[
                      { color: '#57ACAF' },
                      { color: '#EAB308' },
                      { color: '#6F83A7' },
                      { color: '#D0342C' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#57ACAF]" />
                    Monthly Efficiency Trend
                  </h3>
                  <p className="text-sm text-[#6F83A7]">Overall workforce efficiency over time</p>
                </div>
                <MarbimAIButton
                  marbimPrompt="Analyze efficiency trends. Identify: 1) Factors driving efficiency improvements or declines, 2) Seasonal patterns and external impacts, 3) Forecast for next quarter, 4) Actions to maintain upward trajectory."
                  onAskMarbim={onAskMarbim}
                  size="sm"
                />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={[
                  { month: 'May', efficiency: 82 },
                  { month: 'Jun', efficiency: 84 },
                  { month: 'Jul', efficiency: 85 },
                  { month: 'Aug', efficiency: 87 },
                  { month: 'Sep', efficiency: 86 },
                  { month: 'Oct', efficiency: 88 },
                ]}>
                  <defs>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#57ACAF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#57ACAF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" tick={{ fill: '#6F83A7' }} />
                  <YAxis stroke="#6F83A7" tick={{ fill: '#6F83A7' }} domain={[75, 95]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#ffffff' }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Area type="monotone" dataKey="efficiency" stroke="#57ACAF" strokeWidth={3} fillOpacity={1} fill="url(#efficiencyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderAttendanceLeave = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Attendance & Leave</h2>
          <p className="text-sm text-[#6F83A7]">Manage attendance, shifts, and leave requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Calendar className="w-4 h-4 mr-2" />
            Generate Shift
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily-attendance" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="daily-attendance" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <UserCheck className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Daily Attendance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leave-requests" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Leave Requests</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shift-planning" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Clock className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Shift Planning</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily-attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#57ACAF]/10 to-transparent border border-[#57ACAF]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Present</div>
              <div className="text-3xl text-[#57ACAF]">173</div>
            </div>
            <div className="bg-gradient-to-br from-[#D0342C]/10 to-transparent border border-[#D0342C]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Absent</div>
              <div className="text-3xl text-[#D0342C]">18</div>
            </div>
            <div className="bg-gradient-to-br from-[#EAB308]/10 to-transparent border border-[#EAB308]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Late</div>
              <div className="text-3xl text-[#EAB308]">9</div>
            </div>
            <div className="bg-gradient-to-br from-[#6F83A7]/10 to-transparent border border-[#6F83A7]/20 rounded-xl p-6">
              <div className="text-[#6F83A7] mb-2">Attendance Rate</div>
              <div className="text-3xl text-white">94.5%</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Attendance by Line</h3>
            <SmartTable
              columns={dailyAttendanceColumns}
              data={dailyAttendanceData}
              searchPlaceholder="Search lines..."
              onRowClick={handleRowClick}
            />
          </div>
        </TabsContent>

        <TabsContent value="leave-requests" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Leave Requests</h3>
            <SmartTable
              columns={leaveRequestsColumns}
              data={leaveRequestsData}
              searchPlaceholder="Search leave requests..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Leave Optimization</div>
                  <div className="text-sm text-[#6F83A7]">
                    Approve only 2 leaves from finishing to keep capacity stable and meet production targets.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Optimize leave request approvals by analyzing production capacity, department staffing levels, and target deadlines to maintain operational stability."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shift-planning" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Shift Configuration</h3>
            <SmartTable
              columns={shiftPlanningColumns}
              data={shiftPlanningData}
              searchPlaceholder="Search shifts..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Clock className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Shift Balancing</div>
                  <div className="text-sm text-[#6F83A7]">
                    Recommends overtime allocations and shift balancing for optimal production coverage.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze current shift patterns and production demand to recommend optimal overtime allocations and shift balancing strategies that maximize coverage while minimizing labor costs."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Absenteeism Prediction</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Predicted 10% absenteeism tomorrow (Eid travel pattern detected). Plan replacements.
                </p>
                <Button variant="outline" className="w-full border-[#EAB308]/30 text-[#EAB308]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan Replacements
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Attendance Improvement</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Attendance rate improved by 2.3% this week through AI-optimized shift planning.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Weekly Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={attendanceTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="attendance" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderSkillMatrix = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Skill Matrix</h2>
          <p className="text-sm text-[#6F83A7]">Visual representation of worker skills per operation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Download className="w-4 h-4 mr-2" />
            View Skill Matrix
          </Button>
        </div>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="operations" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Settings className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Operations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="by-line" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <MapPin className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">By Line</span>
            </TabsTrigger>
            <TabsTrigger 
              value="by-worker" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">By Worker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="operations" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Skills by Operation</h3>
            <SmartTable
              columns={operationsSkillsColumns}
              data={operationsSkillsData}
              searchPlaceholder="Search operations..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#D0342C]/10 border border-[#D0342C]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">Critical Skill Gap</div>
                  <div className="text-sm text-[#6F83A7]">
                    Bartack operation has 22% skill gap — immediate training priority required.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze the critical skill gap in Bartack operations and develop an immediate training plan to address the 22% deficiency, including resource allocation and timeline recommendations."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="by-line" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Skills by Line</h3>
            <SmartTable
              columns={lineSkillsColumns}
              data={lineSkillsData}
              searchPlaceholder="Search lines..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Users className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Line Optimization</div>
                  <div className="text-sm text-[#6F83A7]">
                    Suggest worker reshuffling to improve Line 4 efficiency from 80% to 87%.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze Line 4 worker skills, current assignments, and production bottlenecks to recommend optimal worker reshuffling strategies that improve efficiency from 80% to 87%."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="by-worker" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Worker Skills</h3>
            <SmartTable
              columns={workerSkillsColumns}
              data={workerSkillsData}
              searchPlaceholder="Search workers..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <BookOpen className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Upskilling Path</div>
                  <div className="text-sm text-[#6F83A7]">
                    Suggest training path for Worker #1027 to improve from 78% to 85% skill score.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Design a personalized upskilling training path for Worker #1027 to improve their skill score from 78% to 85%, including specific modules, timeline, and performance milestones."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Target className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">Priority Training</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Skill gap in bartack operation for Line 5 — training 5 workers will improve overall efficiency.
                </p>
                <Button variant="outline" className="w-full border-[#D0342C]/30 text-[#D0342C]">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Assign Training
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Award className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Cross-Training Opportunity</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Cross-train finishing operators for flexibility and improved line balancing.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Skill Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={[
                  { skill: 'Sewing', level: 88 },
                  { skill: 'Cutting', level: 90 },
                  { skill: 'Finishing', level: 85 },
                  { skill: 'Quality', level: 92 },
                  { skill: 'Bartack', level: 78 },
                ]}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="skill" stroke="#6F83A7" />
                  <PolarRadiusAxis stroke="#6F83A7" />
                  <Radar name="Skill Level" dataKey="level" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderTrainingAssessments = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Training & Assessments</h2>
          <p className="text-sm text-[#6F83A7]">Track training programs and worker evaluations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Assign Training
          </Button>
        </div>
      </div>

      <Tabs defaultValue="training-calendar" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="training-calendar" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Calendar className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Training Calendar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <BookOpen className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Courses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assessments" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Clipboard className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Assessments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="training-calendar" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Upcoming Training Sessions</h3>
            <SmartTable
              columns={trainingCalendarColumns}
              data={trainingCalendarData}
              searchPlaceholder="Search training..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Calendar className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Scheduling</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM suggests schedule based on line downtime and worker availability for optimal participation.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze production line downtime patterns and worker availability to create an optimal training schedule that maximizes participation while minimizing production impact."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Course Catalog</h3>
            <SmartTable
              columns={coursesColumns}
              data={coursesData}
              searchPlaceholder="Search courses..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <BookOpen className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Course Recommendation</div>
                  <div className="text-sm text-[#6F83A7]">
                    Frequent stitching errors detected — recommend refresher training on sewing techniques.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze stitching error patterns and recommend targeted refresher training courses on sewing techniques, including specific modules to address the most common defect types."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Training Assessments</h3>
            <SmartTable
              columns={assessmentsColumns}
              data={assessmentsData}
              searchPlaceholder="Search assessments..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Performance Tracking</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM measures improvement and updates skill scores automatically after assessments.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze worker performance tracking data and assessment results to provide insights on skill score improvements, training effectiveness, and identify workers showing exceptional progress or requiring additional support."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Training Effectiveness</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Training effectiveness +12% for Overlock module. Continue current training methodology.
                </p>
                <Button variant="outline" className="w-full border-[#57ACAF]/30 text-[#57ACAF]">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>

              <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-[#EAB308] flex-shrink-0" />
                  <div className="text-white">Next Recommendation</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Introduce Lean 5S refresher based on waste reduction targets and production feedback.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Training Impact</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={assessmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="preScore" fill="#6F83A7" radius={[8, 8, 0, 0]} name="Pre-Score" />
                  <Bar dataKey="postScore" fill="#57ACAF" radius={[8, 8, 0, 0]} name="Post-Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderWelfareSafety = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white mb-1">Welfare & Safety</h2>
          <p className="text-sm text-[#6F83A7]">Monitor worker welfare and workplace safety compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Log Incident
          </Button>
        </div>
      </div>

      <Tabs defaultValue="welfare" className="space-y-6">
        {/* Tab Navigation */}
        <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-6 shadow-lg shadow-black/20">
          <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
            <TabsTrigger 
              value="welfare" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Users className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Welfare</span>
            </TabsTrigger>
            <TabsTrigger 
              value="safety-audits" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Shield className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Safety Audits</span>
            </TabsTrigger>
            <TabsTrigger 
              value="incidents" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <AlertTriangle className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">Incidents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights" 
              className="relative flex items-center justify-center gap-2.5 py-3.5 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300 group"
            >
              <Sparkles className="w-4 h-4 group-data-[state=active]:scale-110 transition-transform" />
              <span className="text-xs">AI Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="welfare" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Welfare Programs</h3>
            <SmartTable
              columns={welfareColumns}
              data={welfareData}
              searchPlaceholder="Search welfare categories..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Users className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Sentiment Analysis</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM analyzes grievance feedback to detect hidden dissatisfaction and welfare concerns.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze grievance feedback and worker sentiment data to identify hidden dissatisfaction patterns, welfare concerns, and potential workplace issues requiring immediate attention."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="safety-audits" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Safety Audit Results</h3>
            <SmartTable
              columns={safetyAuditsColumns}
              data={safetyAuditsData}
              searchPlaceholder="Search audits..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <Shield className="w-5 h-5 text-[#EAB308] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">Safety Drill Alert</div>
                  <div className="text-sm text-[#6F83A7]">
                    Safety drill overdue for Cutting Section — schedule immediately to maintain compliance.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Review safety drill schedules across all sections, identify overdue drills, and recommend an optimized drill schedule to maintain compliance and minimize production disruption."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-white mb-4">Incident Reports</h3>
            <SmartTable
              columns={incidentsColumns}
              data={incidentsData}
              searchPlaceholder="Search incidents..."
              onRowClick={handleRowClick}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
            <div className="flex items-start gap-3 justify-between pt-[5px] pr-[0px] pb-[0px] pl-[0px]">
              <div className="flex items-start gap-3 flex-1">
                <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">AI Incident Analysis</div>
                  <div className="text-sm text-[#6F83A7]">
                    MARBIM categorizes incidents, assigns responsible teams, and creates CAPAs automatically.
                  </div>
                </div>
              </div>
              <MarbimAIButton
                marbimPrompt="Analyze workplace incidents data to categorize incident types, identify patterns and root causes, recommend team assignments, and generate Corrective and Preventive Action (CAPA) plans automatically."
                onAskMarbim={onAskMarbim}
                size="lg"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-[#D0342C]/10 border border-[#D0342C]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#D0342C] flex-shrink-0" />
                  <div className="text-white">PPE Compliance Alert</div>
                </div>
                <p className="text-sm text-[#6F83A7] mb-4">
                  Fire PPE usage compliance at 93% — below 98% target. Schedule additional training.
                </p>
                <Button variant="outline" className="w-full border-[#D0342C]/30 text-[#D0342C]">
                  <Shield className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
              </div>

              <div className="bg-[#57ACAF]/10 border border-[#57ACAF]/20 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-[#57ACAF] flex-shrink-0" />
                  <div className="text-white">Welfare Improvement</div>
                </div>
                <p className="text-sm text-[#6F83A7]">
                  Overall welfare satisfaction improved by 5% after implementing AI recommendations.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white mb-4">Safety Score Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { month: 'Jul', score: 88 },
                  { month: 'Aug', score: 90 },
                  { month: 'Sep', score: 89 },
                  { month: 'Oct', score: 92 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#6F83A7" />
                  <YAxis stroke="#6F83A7" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1117',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#57ACAF" fill="#57ACAF" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'roster-profiles':
        return renderRosterProfiles();
      case 'attendance-leave':
        return renderAttendanceLeave();
      case 'skill-matrix':
        return renderSkillMatrix();
      case 'training-assessments':
        return renderTrainingAssessments();
      case 'welfare-safety':
        return renderWelfareSafety();
      default:
        return renderDashboard();
    }
  };

  const getBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Operations' },
      { label: 'Workforce Management' }
    ];

    const viewLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'roster-profiles': 'Roster & Profiles',
      'attendance-leave': 'Attendance & Leave',
      'skill-matrix': 'Skill Matrix',
      'training-assessments': 'Training & Assessments',
      'welfare-safety': 'Welfare & Safety',
    };

    if (currentView !== 'dashboard') {
      baseBreadcrumbs.push({ label: viewLabels[currentView] });
    }

    return baseBreadcrumbs;
  };

  return (
    <>
      {showSetupWizard && (
        <WorkforceManagementSetup
          onComplete={() => {
            setShowSetupWizard(false);
            setIsModuleSetup(true);
            toast.success('Workforce Management module configured successfully!');
          }}
          onClose={() => setShowSetupWizard(false)}
          onAskMarbim={onAskMarbim || (() => {})}
        />
      )}

      {!showSetupWizard && (
        <>
          <PageLayout
            breadcrumbs={getBreadcrumbs()}
            aiInsightsCount={8}
          >
            {!isModuleSetup && currentView === 'dashboard' && (
              <ModuleSetupBanner
                moduleName="Workforce Management"
                onSetupClick={() => setShowSetupWizard(true)}
              />
            )}
            {renderContent()}
          </PageLayout>

          {/* Worker Detail Drawer */}
          <WorkerDetailDrawer
            open={workerDrawerOpen}
            onClose={() => setWorkerDrawerOpen(false)}
            worker={selectedWorker}
            onAskMarbim={onAskMarbim}
          />

          {/* Add Worker Drawer */}
          <AddWorkerDrawer
            isOpen={addWorkerDrawerOpen}
            onClose={() => setAddWorkerDrawerOpen(false)}
            onWorkerAdded={handleWorkerAdded}
          />

          {/* Detail Drawer */}
          <DetailDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={selectedRecord?.name || selectedRecord?.workerId || 'Details'}
            recordId={selectedRecord?.id}
          >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="space-y-3">
              {selectedRecord && Object.entries(selectedRecord).slice(0, 8).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-[#6F83A7] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { metric: 'Attendance Rate', value: '96%', trend: '+3%' },
                { metric: 'Skill Score', value: '88%', trend: '+5%' },
                { metric: 'Productivity', value: '92%', trend: '+8%' },
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{item.metric}</span>
                    <span className="text-[#57ACAF]">{item.trend}</span>
                  </div>
                  <div className="text-2xl text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 mt-6">
            <div className="space-y-3">
              {[
                { skill: 'Sewing', level: 92 },
                { skill: 'Quality Check', level: 88 },
                { skill: 'Machine Setup', level: 85 },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">{item.skill}</span>
                    <span className="text-[#57ACAF]">{item.level}%</span>
                  </div>
                  <Progress value={item.level} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4 mt-6">
            <div className="p-4 rounded-xl bg-[#57ACAF]/10 border border-[#57ACAF]/20">
              <div className="text-white mb-2">Performance Analysis</div>
              <div className="text-sm text-[#6F83A7] mb-3">
                High-performing worker with consistent attendance and skill improvement trend.
              </div>
              <div className="flex items-center gap-3">
                <Progress value={92} className="flex-1 h-2" />
                <span className="text-[#57ACAF]">92%</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white mb-2">Recommendation</div>
              <div className="text-sm text-[#6F83A7]">
                Consider for advanced training in specialized operations to maximize potential.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/20">
              <div className="text-white mb-2">Next Steps</div>
              <div className="text-sm text-[#6F83A7] mb-3">
                Assign to mentor junior workers and cross-train on bartack operation.
              </div>
              <Button size="sm" className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black">
                Create Task
              </Button>
            </div>
          </TabsContent>
        </Tabs>
          </DetailDrawer>
        </>
      )}
    </>
  );
}
