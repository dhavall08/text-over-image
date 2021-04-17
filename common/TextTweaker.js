import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Button, Icon, Segment, Tab } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import rgbHex from 'rgb-hex';

const sections = {
  tC: { text: 'Text Color', param: 'color' },
  bC: {
    text: 'Background Color',
    param: 'backgroundColor',
  },
  tS: { text: 'Text Size', param: 'fontSize' },
  reset: 'reset',
};

function TextTweaker({ changeHandler, values }) {
  const [open, setOpen] = useState(false);

  const settings = {
    start: 6,
    min: 6,
    max: 48,
    step: 2,
    onChange: (value) => {
      changeHandler(sections.tS.param, value);
    },
  };

  const panes = [
    {
      menuItem: sections.tC.text,
      render() {
        return (
          <ChromePicker
            color={values[sections.tC.param]}
            onChange={(c) =>
              changeHandler(
                sections.tC.param,
                `#${rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)}`
              )
            }
          />
        );
      },
    },
    {
      menuItem: sections.bC.text,
      render() {
        return (
          <ChromePicker
            color={values[sections.bC.param]}
            onChange={(c) =>
              changeHandler(
                sections.bC.param,
                `#${rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)}`
              )
            }
          />
        );
      },
    },
    {
      menuItem: sections.tS.text,
      render() {
        return (
          <Segment>
            <>
              {isNaN(values[sections.tS.param]) ||
                `${values[sections.tS.param]}px`}
              <Slider
                color="green"
                settings={settings}
                value={values[sections.tS.param]}
              />
            </>
          </Segment>
        );
      },
    },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <div className="floating-icon">
        <Button
          icon
          circular
          size="huge"
          color="green"
          onClick={() => changeHandler(sections.reset)}
        >
          <Icon inverted name="refresh" />
        </Button>
        <Button
          icon
          circular
          size="huge"
          color={open ? 'grey' : 'green'}
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icon inverted name={open ? 'close' : 'plus'} />
        </Button>
      </div>
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        renderActiveOnly={open}
        onTabChange={() => setOpen(true)}
      />
    </div>
  );
}

export default TextTweaker;
