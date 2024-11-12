import { IconType } from 'react-icons';
import { ComponentType, SVGProps } from 'react';
export interface NavItem {
  name: string;
  href: string;
  icon: IconType | ComponentType<SVGProps<SVGSVGElement>>; // Додано підтримку IconType
}

export type ImageAreaProps = {
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
};
