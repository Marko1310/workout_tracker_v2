// React
import { ThreeDots } from 'react-loader-spinner';

const threeDotsProps = {
  height: '80',
  width: '80',
  radius: '9',
  color: '#000',
  ariaLabel: 'three-dots-loading',
  wrapperStyle: {},
  wrapperClassName: '',
  visible: true,
};

const Loading = () => {
  return (
    <div className="loading">
      <ThreeDots {...threeDotsProps} />
      <h2 className="loading-title">Loading</h2>
    </div>
  );
};

export default Loading;
