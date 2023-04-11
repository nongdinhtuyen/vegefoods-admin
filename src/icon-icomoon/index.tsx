import iconSet from './selection.json';
import IcoMoon, { IconProps } from 'react-icomoon';

const Icon = ({ ...props }: IconProps) => <IcoMoon iconSet={iconSet} {...props} />;

Icon.defaultProps = {
  size: 16,
};

export default Icon;
