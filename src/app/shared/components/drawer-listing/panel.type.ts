import { RoleEnum } from '@modules/admin/admin/users/enums/role.enum';

export interface PanelType {
    id?: string,
    icon?: string,
    selectedIcon?: string,
    title: string,
    description?: string,
    link?: string | Array<string>,
    disabled?: boolean,
    children?: PanelType[],
    requiredRoles?: RoleEnum[]
}
