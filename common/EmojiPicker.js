import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

function EmojiPicker({ open, selectEmoji }) {
  return (
    <div style={{ position: 'relative' }}>
      <Picker
        style={{ display: open ? 'block' : 'none' }}
        onSelect={selectEmoji}
        showPreview={false}
      />
    </div>
  );
}

export default EmojiPicker;
