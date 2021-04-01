import { useState } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { Button, Form } from 'semantic-ui-react';

function EmojiPicker({ selectEmoji }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Form.Field>
        <Button
          basic
          labelPosition="left"
          color="purple"
          content={open ? 'Close' : 'Add Emoji'}
          icon={open ? 'close' : 'plus'}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
        />
      </Form.Field>
      <Picker
        style={{ display: open ? 'block' : 'none' }}
        onSelect={selectEmoji}
        showPreview={false}
      />
    </div>
  );
}

export default EmojiPicker;
