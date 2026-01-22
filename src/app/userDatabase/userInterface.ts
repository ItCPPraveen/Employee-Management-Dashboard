export interface Employee {
    EMPLOYEE_ID: number;
    FIRST_NAME: string;
    LAST_NAME: string;
    EMAIL: string;
    PASSWORD?: string; // Optional so it doesn't show in tables
    ROLE: 'admin' | 'manager' | 'employee';
    PHONE_NUMBER: string,
    HIRE_DATE: string,
    JOB_ID: string,
    SALARY: number,
    DEPARTMENT_ID: number
}