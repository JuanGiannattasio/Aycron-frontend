

export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public role: 'ADMIN_ROLE' | 'USER_ROLE',
        public uid?: string
    ) {}
}