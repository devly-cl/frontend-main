import { RoleEnum } from '@modules/admin/admin/users/enums/role.enum';

export interface ICompanyUser {
    id: string;
    name: string;
    username: string;
    logo: any;
    position: any;
    role: RoleEnum;
    isActive: boolean;
}
