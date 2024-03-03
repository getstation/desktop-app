import { Seq, List } from 'immutable';
import { Instance, Instances } from './types';

export const withInstanceNumber = (instances: Instances): Instances => {
  const grouped: Seq.Keyed<string, Instances> = instances.groupBy((acc: Instance) => acc.name);

  return grouped
    .map((groupedInstances: Instances) => {
      if (groupedInstances.size > 1) {
        return groupedInstances.map(
          (instance: Instance, i: number) =>
            ({ ...instance, name: `${instance.name} #${i + 1}` })
        );
      }

      return groupedInstances;
    })
    .toList()
    .flatten();
};

export const orderInstances = (instances: Instances, applicationIds: List<string>): Instances => {
  return List(applicationIds
    .map(id => {
      return instances.find((instance: Instance) => instance.id === id);
    })
    .filter(Boolean)
  );
};
