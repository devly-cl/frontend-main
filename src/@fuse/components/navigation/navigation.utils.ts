import { FuseNavigationItem } from './navigation.types';
import { ICompanyUser }       from '@core/domain/interfaces/company-user.interface';
import { RoleEnum }           from '@modules/admin/admin/users/enums/role.enum';

/**
 * Check if the user has access to the navigation item
 *
 * @param item
 * @param companyUser
 */
export const canAccess = (item: FuseNavigationItem, companyUser: ICompanyUser): boolean => {
    // If there's no user, deny access
    if (!companyUser || !companyUser.role) return false;

    // If the user is an admin, allow access to everything
    if (companyUser.role === RoleEnum.ADMIN) return true;

    // If the item doesn't have requiredRoles or it's an empty array, allow access
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;

    // Check if the user's role is in the requiredRoles array
    return item.requiredRoles.includes(companyUser.role);
};
