export interface userData {
    admin: userDetails
    employee?: userDetails[]
    manager?: userDetails[]
}

export interface userDetails {
    email: string;
    password: string;
}