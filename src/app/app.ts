/**********************************************************************
 *  IMPORT SECTION
 *********************************************************************/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/**********************************************************************
 *  ENUM / TYPES
 *********************************************************************/
type CaseStatus = 'OPEN' | 'CLOSED' | 'STAY' | 'ON_HOLD';

/**********************************************************************
 *  INTERFACES
 *********************************************************************/
interface ClientType {
  id: number;
  typeName: string;

}

interface CaseType {
  id: number;
  name: string;
}


interface CaseItem {
  clientType: string;
  id: number;
  fileNo: string;
  caseNo: string;
  caseTitle: string;
  partyRepresent: string;
  caseType: string;
  courtName: string;
  city: string;

  handledByName: string;
  handledByPhone: string;
  handledByAddress: string;
  handledByEmail?: string;

  nextHearingDate?: string;
  fixedFor?: string;

  status: CaseStatus;
  createdAt: string;
}

interface FinanceEntry {
  id: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  title: string;
  amount: number;
  note?: string;
}

/**********************************************************************
 *  COMPONENT
 *********************************************************************/
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
    // FILTER PANEL TOGGLE
      showFilterPanel = false;

      toggleFilterPanel() {
        this.showFilterPanel = !this.showFilterPanel;
      }

      closeFilterPanel() {
        this.showFilterPanel = false;
      }

  /******************************************************************
   *  TAB NAVIGATION
   ******************************************************************/
  activeTab: 'dashboard' | 'new' | 'calendar' | 'finance' = 'dashboard';

  /******************************************************************
   *  CLIENT TYPE DROPDOWN DATA
   ******************************************************************/
  clientTypes: ClientType[] = [];
  filteredClientTypes: ClientType[] = [];
  showClientTypeDropdown = false;
  /******************************************************************
   *  CASE TYPE DROPDOWN DATA
   ******************************************************************/
  caseTypes: CaseType[] = [];
  filteredCaseTypes: CaseType[] = [];
  showCaseTypeDropdown = false;

  /******************************************************************
   *  DASHBOARD FILTER FORM
   ******************************************************************/
  filterForm = {
    fileNo: '',
    caseNo: '',
    caseTitle: '',
    courtName: '',
    city: '',
    handledByName: '',
    status: 'ALL' as CaseStatus | 'ALL',
    searchText: '',
    upcomingOnly: false
  };

  /******************************************************************
   *  APPLIED FILTERS
   ******************************************************************/
  appliedFilters = { ...this.filterForm };

  /******************************************************************
   *  DEMO CASE DATA
   ******************************************************************/
  cases: CaseItem[] = [
    {
      clientType: 'Individual',
      id: 1,
      fileNo: 'F-1001',
      caseNo: 'CN-01/2026',
      caseTitle: 'Rajput vs Sharma',
      partyRepresent: 'Plaintiff',
      caseType: 'Civil',
      courtName: 'District Court',
      city: 'Raipur',
      handledByName: 'Adv Yograj',
      handledByPhone: '9999999999',
      handledByAddress: 'Tikrapara',
      nextHearingDate: this.todayPlusDays(2),
      fixedFor: 'Evidence',
      status: 'OPEN',
      createdAt: this.todayISO()
    },
    {
      clientType: 'Corporate',
      id: 2,
      fileNo: 'F-1002',
      caseNo: 'CN-02/2026',
      caseTitle: 'ABC Corp vs XYZ Ltd',
      partyRepresent: 'Defendant',
      caseType: 'Corporate',
      courtName: 'High Court',
      city: 'Bilaspur',
      handledByName: 'Adv Sharma',
      handledByPhone: '8888888888',
      handledByAddress: 'Civil Lines',
      nextHearingDate: this.todayPlusDays(10),
      fixedFor: 'Arguments',
      status: 'ON_HOLD',
      createdAt: this.todayPlusDays(-5)
    },
    {
      clientType: 'Individual',
      id: 3,
      fileNo: 'F-1003',
      caseNo: 'CN-03/2026',
      caseTitle: 'Patel vs Government',
      partyRepresent: 'Plaintiff',
      caseType: 'Civil',
      courtName: 'District Court',
      city: 'Nagpur',
      handledByName: 'Adv Verma',
      handledByPhone: '7777777777',
      handledByAddress: 'Dharampeth',
      nextHearingDate: this.todayPlusDays(5),
      fixedFor: 'Cross Examination',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-3)
    },
    {
      clientType: 'Corporate',
      id: 4,
      fileNo: 'F-1004',
      caseNo: 'CN-04/2026',
      caseTitle: 'Tech Solutions Inc vs Competitors',
      partyRepresent: 'Plaintiff',
      caseType: 'Commercial',
      courtName: 'High Court',
      city: 'Mumbai',
      handledByName: 'Adv Desai',
      handledByPhone: '9876543210',
      handledByAddress: 'Fort',
      nextHearingDate: this.todayPlusDays(15),
      fixedFor: 'Hearing',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-10)
    },
    {
      clientType: 'Individual',
      id: 5,
      fileNo: 'F-1005',
      caseNo: 'CN-05/2026',
      caseTitle: 'Singh vs Singh (Property Dispute)',
      partyRepresent: 'Defendant',
      caseType: 'Property',
      courtName: 'District Court',
      city: 'Indore',
      handledByName: 'Adv Kumar',
      handledByPhone: '8765432109',
      handledByAddress: 'South Tukoganj',
      nextHearingDate: this.todayPlusDays(8),
      fixedFor: 'Judgment',
      status: 'CLOSED',
      createdAt: this.todayPlusDays(-20)
    },
    {
      clientType: 'Corporate',
      id: 6,
      fileNo: 'F-1006',
      caseNo: 'CN-06/2026',
      caseTitle: 'Manufacturing Co. vs Supplier',
      partyRepresent: 'Plaintiff',
      caseType: 'Corporate',
      courtName: 'High Court',
      city: 'Pune',
      handledByName: 'Adv Joshi',
      handledByPhone: '8654321098',
      handledByAddress: 'Camp',
      nextHearingDate: this.todayPlusDays(12),
      fixedFor: 'Settlement',
      status: 'ON_HOLD',
      createdAt: this.todayPlusDays(-7)
    },
    {
      clientType: 'Individual',
      id: 7,
      fileNo: 'F-1007',
      caseNo: 'CN-07/2026',
      caseTitle: 'Khan vs Khan (Family Matter)',
      partyRepresent: 'Plaintiff',
      caseType: 'Family',
      courtName: 'Family Court',
      city: 'Goa',
      handledByName: 'Adv Mendes',
      handledByPhone: '7654321087',
      handledByAddress: 'Panjim',
      nextHearingDate: this.todayPlusDays(3),
      fixedFor: 'Mediation',
      status: 'OPEN',
      createdAt: this.todayISO()
    },
    {
      clientType: 'Corporate',
      id: 8,
      fileNo: 'F-1008',
      caseNo: 'CN-08/2026',
      caseTitle: 'Finance Ltd vs Defaulters',
      partyRepresent: 'Plaintiff',
      caseType: 'Banking',
      courtName: 'DRT (Debt Recovery Tribunal)',
      city: 'Ahmedabad',
      handledByName: 'Adv Mehta',
      handledByPhone: '9123456789',
      handledByAddress: 'Thaltej',
      nextHearingDate: this.todayPlusDays(6),
      fixedFor: 'Recovery',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-2)
    },
    {
      clientType: 'Individual',
      id: 9,
      fileNo: 'F-1009',
      caseNo: 'CN-09/2026',
      caseTitle: 'Consumer vs Retail Chain',
      partyRepresent: 'Plaintiff',
      caseType: 'Consumer',
      courtName: 'Consumer Court',
      city: 'Bangalore',
      handledByName: 'Adv Reddy',
      handledByPhone: '8012345678',
      handledByAddress: 'Indiranagar',
      nextHearingDate: this.todayPlusDays(4),
      fixedFor: 'Compensation Award',
      status: 'STAY',
      createdAt: this.todayPlusDays(-15)
    },
    {
      clientType: 'Corporate',
      id: 10,
      fileNo: 'F-1010',
      caseNo: 'CN-10/2026',
      caseTitle: 'Power Generation Corp vs Ministry',
      partyRepresent: 'Defendant',
      caseType: 'Public Law',
      courtName: 'High Court',
      city: 'Delhi',
      handledByName: 'Adv Singh',
      handledByPhone: '9876543211',
      handledByAddress: 'Chanakya Place',
      nextHearingDate: this.todayPlusDays(20),
      fixedFor: 'Arguments',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-25)
    },
    {
      clientType: 'Individual',
      id: 11,
      fileNo: 'F-1011',
      caseNo: 'CN-11/2026',
      caseTitle: 'Employee vs Employer (Labor Dispute)',
      partyRepresent: 'Plaintiff',
      caseType: 'Labour',
      courtName: 'Labour Court',
      city: 'Hyderabad',
      handledByName: 'Adv Nair',
      handledByPhone: '7890123456',
      handledByAddress: 'Jubilee Hills',
      nextHearingDate: this.todayPlusDays(7),
      fixedFor: 'Evidence',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-8)
    },
    {
      clientType: 'Corporate',
      id: 12,
      fileNo: 'F-1012',
      caseNo: 'CN-12/2026',
      caseTitle: 'Software Inc vs Patent Infringement',
      partyRepresent: 'Defendant',
      caseType: 'Cyber Crime',
      courtName: 'High Court',
      city: 'Bangalore',
      handledByName: 'Adv Rao',
      handledByPhone: '9345678901',
      handledByAddress: 'Koramangala',
      nextHearingDate: this.todayPlusDays(14),
      fixedFor: 'Hearing',
      status: 'OPEN',
      createdAt: this.todayPlusDays(-12)
    }
  ];

  /******************************************************************
   *  SELECTED DATE
   ******************************************************************/
  selectedDate = this.todayISO();

  /******************************************************************
   *  CASE FORM MODEL
   ******************************************************************/
  caseModel: Omit<CaseItem, 'id'> = this.emptyCaseModel();

  /******************************************************************
   *  EDIT MODE
   ******************************************************************/
  editingId: number | null = null;

  /******************************************************************
   *  FINANCE DATA
   ******************************************************************/
  financeEntries: FinanceEntry[] = [];

  financeModel: Omit<FinanceEntry, 'id'> = {
    date: this.todayISO(),
    type: 'INCOME',
    title: '',
    amount: 0,
    note: ''
  };

  /******************************************************************
   *  CALENDAR STATE
   ******************************************************************/
  calYear = new Date().getFullYear();
  calMonth = new Date().getMonth();

  /******************************************************************
   *  CONSTRUCTOR
   ******************************************************************/
  constructor(private http: HttpClient) {}

  /******************************************************************
   *  INIT
   ******************************************************************/
  ngOnInit(): void {
    this.loadClientTypes();
    this.loadCaseTypes();
  }

  /******************************************************************
   *  LOAD CLIENT TYPES FROM API
   ******************************************************************/
  loadClientTypes() {
    this.http
      .get<ClientType[]>('http://localhost:8080/api/case_diary/v1/client_type')
      .subscribe({
        next: (data) => {
          this.clientTypes = data || [];
          this.filteredClientTypes = [...this.clientTypes];
        },
        error: (err) => {
          console.error('Client type API error', err);
        }
      });
  }

//   loadCaseTypes() {
//   this.http
//     .get<CaseType[]>('http://localhost:8080/api/case_diary/v1/case_type')
//     .subscribe({
//       next: (data) => {
//         this.caseTypes = data || [];
//         this.filteredCaseTypes = [...this.caseTypes];
//       },
//       error: (err) => {
//         console.error('Case type API error:', err);
//       }
//     });
// }

loadCaseTypes() {
  this.http
    .get<any[]>('http://localhost:8080/api/case_diary/v1/case_type')
    .subscribe({
      next: (data) => {
        console.log('Case type API response:', data);
        this.caseTypes = data || [];
        this.filteredCaseTypes = [...this.caseTypes];
      },
      error: (err) => {
        console.error('Case type API error:', err);
      }
    });
}

  /******************************************************************
   *  CLIENT TYPE SEARCH
   ******************************************************************/
  filterClientTypes() {
    const value = (this.caseModel.clientType || '').toLowerCase().trim();

    this.filteredClientTypes = this.clientTypes.filter(item =>
      item.typeName.toLowerCase().includes(value)
    );

    this.showClientTypeDropdown = true;
  }

    /******************************************************************
   *  CASE TYPE SEARCH
   ******************************************************************/
  filterCaseTypes() {
  const value = (this.caseModel.caseType || '').toLowerCase().trim();

  this.filteredCaseTypes = this.caseTypes.filter(item =>
    item.name.toLowerCase().includes(value)
  );

  this.showCaseTypeDropdown = true;
}
  /******************************************************************
   *  SELECT CLIENT TYPE
   ******************************************************************/
  selectClientType(item: ClientType) {
    this.caseModel.clientType = item.typeName;
    this.showClientTypeDropdown = false;
  }
  /******************************************************************
   *  SELECT CASETYPE
   ******************************************************************/
  selectCaseType(item: CaseType) {
  this.caseModel.caseType = item.name;
  this.showCaseTypeDropdown = false;
}
  /******************************************************************
   *  HIDE CLIENT TYPE DROPDOWN
   ******************************************************************/
  hideClientTypeDropdown() {
    setTimeout(() => {
      this.showClientTypeDropdown = false;
    }, 200);
  }
   /******************************************************************
   *  HIDE CLIENT TYPE DROPDOWN
   ******************************************************************/
  /******************************************************************
   *  HIDE CASE TYPE DROPDOWN
   ******************************************************************/
  hideCaseTypeDropdown() {
    setTimeout(() => {
      this.showCaseTypeDropdown = false;
    }, 200);
  }
  /******************************************************************
   *  TAB CHANGE
   ******************************************************************/
  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
  }

  /******************************************************************
   *  APPLY FILTERS
   ******************************************************************/
  applyFilters() {
    this.appliedFilters = { ...this.filterForm };
    this.showFilterPanel = false;
  }

  /******************************************************************
   *  RESET FILTERS
   ******************************************************************/
  resetAppliedFilters() {
    this.filterForm = {
      fileNo: '',
      caseNo: '',
      caseTitle: '',
      courtName: '',
      city: '',
      handledByName: '',
      status: 'ALL',
      searchText: '',
      upcomingOnly: false
    };

    this.appliedFilters = { ...this.filterForm };
  }

  /******************************************************************
   *  FILTERED CASES
   ******************************************************************/
  get filteredCases(): CaseItem[] {
    let list = [...this.cases];
    const f = this.appliedFilters;

    if (f.fileNo) {
      list = list.filter(c => c.fileNo.toLowerCase().includes(f.fileNo.toLowerCase()));
    }

    if (f.caseNo) {
      list = list.filter(c => c.caseNo.toLowerCase().includes(f.caseNo.toLowerCase()));
    }

    if (f.caseTitle) {
      list = list.filter(c => c.caseTitle.toLowerCase().includes(f.caseTitle.toLowerCase()));
    }

    if (f.courtName) {
      list = list.filter(c => c.courtName === f.courtName);
    }

    if (f.city) {
      list = list.filter(c => c.city === f.city);
    }

    if (f.handledByName) {
      list = list.filter(c => c.handledByName === f.handledByName);
    }

    if (f.status !== 'ALL') {
      list = list.filter(c => c.status === f.status);
    }

    if (f.upcomingOnly) {
      const today = this.todayISO();
      list = list.filter(c => (c.nextHearingDate || '') >= today);
    }

    if (f.searchText && f.searchText.length >= 3) {
      list = list.filter(c =>
        c.caseTitle.toLowerCase().includes(f.searchText.toLowerCase())
      );
    }

    return list;
  }

  /******************************************************************
   *  DROPDOWN OPTIONS FOR FILTERS
   ******************************************************************/
  get courtOptions(): string[] {
    return [...new Set(this.cases.map(c => c.courtName).filter(Boolean))];
  }

  get cityOptions(): string[] {
    return [...new Set(this.cases.map(c => c.city).filter(Boolean))];
  }

  get advocateOptions(): string[] {
    return [...new Set(this.cases.map(c => c.handledByName).filter(Boolean))];
  }

  /******************************************************************
   *  SELECTED DATE COUNT
   ******************************************************************/
  get casesOnSelectedDateCount(): number {
    const d = this.selectedDate;
    return this.cases.filter(c => c.nextHearingDate === d).length;
  }

  /******************************************************************
   *  CASES ON SELECTED DATE
   ******************************************************************/
  get casesOnSelectedDate(): CaseItem[] {
    const d = this.selectedDate;
    return this.cases.filter(c => c.nextHearingDate === d);
  }

  /******************************************************************
   *  SELECT DATE FROM CALENDAR
   ******************************************************************/
  onSelectDate(dateISO: string) {
    this.selectedDate = dateISO;
  }

  /******************************************************************
   *  CALENDAR TITLE
   ******************************************************************/
  get calendarTitle(): string {
    const date = new Date(this.calYear, this.calMonth, 1);
    return date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  }

  /******************************************************************
   *  PREVIOUS MONTH
   ******************************************************************/
  prevMonth() {
    this.calMonth--;
    if (this.calMonth < 0) {
      this.calMonth = 11;
      this.calYear--;
    }
  }

  /******************************************************************
   *  NEXT MONTH
   ******************************************************************/
  nextMonth() {
    this.calMonth++;
    if (this.calMonth > 11) {
      this.calMonth = 0;
      this.calYear++;
    }
  }

  /******************************************************************
   *  CALENDAR DAYS GRID
   ******************************************************************/
  get calendarDays(): Array<{ dateISO: string; dayNum: number; isCurrentMonth: boolean; count: number }> {
    const firstDay = new Date(this.calYear, this.calMonth, 1);
    const startWeekday = firstDay.getDay();
    const start = new Date(this.calYear, this.calMonth, 1 - startWeekday);

    const days: Array<{ dateISO: string; dayNum: number; isCurrentMonth: boolean; count: number }> = [];

    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const iso = this.toISODate(d);
      const isCurrentMonth = d.getMonth() === this.calMonth;
      const count = this.cases.filter(c => c.nextHearingDate === iso).length;

      days.push({
        dateISO: iso,
        dayNum: d.getDate(),
        isCurrentMonth,
        count
      });
    }

    return days;
  }

  /******************************************************************
   *  SAVE CASE
   ******************************************************************/
  saveCase() {
    if (!this.caseModel.fileNo.trim() || !this.caseModel.caseTitle.trim()) {
      alert('File No and Case Title required');
      return;
    }

    if (this.editingId === null) {
      const newCase: CaseItem = {
        ...this.caseModel,
        id: this.nextId(this.cases.map(c => c.id))
      };
      this.cases.unshift(newCase);
    } else {
      const idx = this.cases.findIndex(c => c.id === this.editingId);

      if (idx >= 0) {
        this.cases[idx] = { ...this.caseModel, id: this.editingId };
      }

      this.editingId = null;
    }

    this.caseModel = this.emptyCaseModel();
    this.showClientTypeDropdown = false;
    this.activeTab = 'dashboard';
  }

  /******************************************************************
   *  EDIT CASE
   ******************************************************************/
  editCase(item: CaseItem) {
    this.editingId = item.id;
    const { id, ...rest } = item;
    this.caseModel = { ...rest };
    this.activeTab = 'new';
  }

  /******************************************************************
   *  DELETE CASE
   ******************************************************************/
  deleteCase(id: number) {
    const ok = confirm('Delete this case?');
    if (!ok) return;
    this.cases = this.cases.filter(c => c.id !== id);
  }

  /******************************************************************
   *  ADD EXPENSES
   ******************************************************************/
  addExpenses(caseId: number) {
    alert(`Add expenses for case ID: ${caseId}`);
    // TODO: Implement add expenses functionality
  }

  /******************************************************************
   *  ADD ADVOCATE FEES
   ******************************************************************/
  addAdvocateFees(caseId: number) {
    alert(`Add advocate fees for case ID: ${caseId}`);
    // TODO: Implement add advocate fees functionality
  }

  /******************************************************************
   *  CANCEL EDIT
   ******************************************************************/
  cancelEdit() {
    this.editingId = null;
    this.caseModel = this.emptyCaseModel();
    this.showClientTypeDropdown = false;
  }

  /******************************************************************
   *  ADD FINANCE ENTRY
   ******************************************************************/
  addFinanceEntry() {
    if (!this.financeModel.title.trim() || !this.financeModel.date) {
      alert('Finance title and date are required.');
      return;
    }

    if (this.financeModel.amount <= 0) {
      alert('Amount must be > 0');
      return;
    }

    const entry: FinanceEntry = {
      ...this.financeModel,
      id: this.nextId(this.financeEntries.map(e => e.id)),
      amount: Number(this.financeModel.amount)
    };

    this.financeEntries.unshift(entry);

    this.financeModel = {
      date: this.todayISO(),
      type: 'INCOME',
      title: '',
      amount: 0,
      note: ''
    };
  }

  /******************************************************************
   *  DELETE FINANCE ENTRY
   ******************************************************************/
  deleteFinanceEntry(id: number) {
    const ok = confirm('Delete finance entry?');
    if (!ok) return;
    this.financeEntries = this.financeEntries.filter(e => e.id !== id);
  }

  /******************************************************************
   *  TOTAL INCOME
   ******************************************************************/
  get totalIncome(): number {
    return this.financeEntries
      .filter(e => e.type === 'INCOME')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /******************************************************************
   *  TOTAL EXPENSE
   ******************************************************************/
  get totalExpense(): number {
    return this.financeEntries
      .filter(e => e.type === 'EXPENSE')
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /******************************************************************
   *  NET BALANCE
   ******************************************************************/
  get netBalance(): number {
    return this.totalIncome - this.totalExpense;
  }

  /******************************************************************
   *  EMPTY CASE MODEL
   ******************************************************************/
  private emptyCaseModel(): Omit<CaseItem, 'id'> {
    return {
      clientType: '',
      fileNo: '',
      caseNo: '',
      caseTitle: '',
      partyRepresent: '',
      caseType: '',
      courtName: '',
      city: '',
      handledByName: '',
      handledByPhone: '',
      handledByAddress: '',
      handledByEmail: '',
      nextHearingDate: '',
      fixedFor: '',
      status: 'OPEN',
      createdAt: this.todayISO()
    };
  }

  /******************************************************************
   *  NEXT ID
   ******************************************************************/
  private nextId(ids: number[]): number {
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }

  /******************************************************************
   *  TODAY ISO
   ******************************************************************/
  private todayISO(): string {
    return this.toISODate(new Date());
  }

  /******************************************************************
   *  TODAY PLUS DAYS
   ******************************************************************/
  private todayPlusDays(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return this.toISODate(d);
  }

  /******************************************************************
   *  DATE TO ISO
   ******************************************************************/
  private toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}