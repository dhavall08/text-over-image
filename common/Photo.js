import { useState, memo } from 'react';
import { Card, Icon } from 'semantic-ui-react';
// import '../styles/Home.css';
import { appName } from './utils/helper';

function Photo({ details, clickHandler = () => {} }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { user, urls, links } = details;

  function openURL(e, name) {
    e.stopPropagation();

    let url;
    switch (name) {
      case 'Photo':
        url = `${links?.html}?utm_source=${appName}&utm_medium=referral`;
        break;
      case 'Author':
        url = `${user?.links?.html}?utm_source=${appName}&utm_medium=referral`;
        break;
      case 'Unsplash':
        url = `https://unsplash.com/?utm_source=${appName}&utm_medium=referral`;
        break;
      default:
        url = '';
    }

    window.open(url, '_blank');
  }

  return (
    <a
      tabIndex={0}
      href="#"
      className="ui card"
      onClick={(e) => {
        e.preventDefault();
        clickHandler(details);
      }}
    >
      <div
        className={`image img ${imageLoaded ? 'img-visible' : 'img-hidden'}`}
      >
        <img src={urls.small} onLoad={() => setImageLoaded(true)} />
      </div>
      <Card.Content extra textAlign="left">
        <Icon name="user circle" />
        <span
          tabIndex={0}
          className="link"
          onClick={(e) => openURL(e, 'Photo')}
        >
          Photo
        </span>{' '}
        by{' '}
        <span
          tabIndex={0}
          className="link"
          onClick={(e) => openURL(e, 'Author')}
        >
          {user.name}
        </span>{' '}
        on{' '}
        <span
          tabIndex={0}
          className="link"
          onClick={(e) => openURL(e, 'Unsplash')}
        >
          Unsplash
        </span>
      </Card.Content>
    </a>
  );
}

Photo.displayName = 'Photo';

export default memo(Photo);
