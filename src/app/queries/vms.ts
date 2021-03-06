import { QueryResult } from 'react-query';
import { usePollingContext } from '@app/common/context';
import { useAuthorizedFetch } from './fetchHelpers';
import { sortResultsByName, useMockableQuery, getInventoryApiUrl } from './helpers';
import { MOCK_VMWARE_VMS } from './mocks/vms.mock';
import { IVMwareProvider } from './types';
import { IVMwareVM } from './types/vms.types';

export const useVMwareVMsQuery = (provider: IVMwareProvider | null): QueryResult<IVMwareVM[]> => {
  const result = useMockableQuery<IVMwareVM[]>(
    {
      queryKey: ['vms', provider?.name],
      queryFn: useAuthorizedFetch(
        getInventoryApiUrl(`${provider?.selfLink || ''}/vms?detail=true`)
      ),
      config: {
        enabled: !!provider,
        refetchInterval: usePollingContext().refetchInterval,
      },
    },
    MOCK_VMWARE_VMS
  );
  return sortResultsByName(result);
};

export const findVMById = (id: string, vmsQuery: QueryResult<IVMwareVM[]>): IVMwareVM | null =>
  vmsQuery.data?.find((vm) => vm.id === id) || null;
