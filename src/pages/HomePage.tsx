import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/pro-solid-svg-icons';

export const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <FontAwesomeIcon icon={icons.faCherries} />
    </div>
  );
};
