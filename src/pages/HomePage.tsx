import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid as icons } from '@fortawesome/fontawesome-svg-core/import.macro';

export const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <FontAwesomeIcon icon={icons('save')} />
    </div>
  );
};
