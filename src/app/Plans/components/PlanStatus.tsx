import * as React from 'react';
import { IMigration, IPlan } from '@app/queries/types';
import { StatusIcon, StatusType } from '@konveyor/lib-ui';
import { Level, LevelItem, Progress, ProgressMeasureLocation, Text } from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';

interface IPlanStatusProps {
  plan: IPlan;
  migration: IMigration;
}

const PlanStatus: React.FunctionComponent<IPlanStatusProps> = ({
  plan,
  migration,
}: IPlanStatusProps) => {
  if (plan.status.conditions.every((condition) => condition.type === 'Ready')) {
    return <StatusIcon status={StatusType.Ok} label="Ready" />;
  } else {
    // TODO: This is only a placeholder, more statuses check needs to be done.
    const totalVMs = plan.spec.vmList.length;
    const percentVMsDone = totalVMs > 0 ? (migration.status.nbVMsDone * 100) / totalVMs : 0;
    const label = 'Running';

    return (
      <>
        <Level className={`${spacing.mbXs} ${spacing.prMd}`}>
          <LevelItem>
            <StatusIcon
              status={StatusType.Warning}
              label={<Text component="small">{label}</Text>}
            />
          </LevelItem>
          <LevelItem>
            <Text component="small">{`${migration.status.nbVMsDone} of ${plan.spec.vmList.length} VMs migrated`}</Text>
          </LevelItem>
        </Level>
        <Progress value={percentVMsDone} measureLocation={ProgressMeasureLocation.none} />
      </>
    );
  }
};

export default PlanStatus;