import React from 'react';
import { Icon } from 'semantic-ui-react';

function InfoTip({ children, colorClass, icon }) {
  return (
    <div className={`instruction ${colorClass}`}>
      <Icon name={icon} />
      <div>{children}</div>
    </div>
  );
}

InfoTip.defaultProps = {
  icon: 'help circle',
  colorClass: '',
};

export default React.memo(InfoTip);
