import React, { useState } from 'react';
import { TwitterPicker } from 'react-color';
import { Button, Icon, Segment, Tab } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';

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
  const [open, setOpen] = useState(true);

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
          <TwitterPicker
            colors={colors}
            triangle="hide"
            width="100%"
            onChange={(data) => changeHandler(sections.tC.param, data.hex)}
          />
        );
      },
    },
    {
      menuItem: sections.bC.text,
      render() {
        return (
          <TwitterPicker
            colors={colors}
            triangle="hide"
            width="100%"
            onChange={(data) => changeHandler(sections.bC.param, data.hex)}
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
          color="grey"
          onClick={() => changeHandler(sections.reset)}
        >
          <Icon inverted name="refresh" />
        </Button>
        <Button
          icon
          circular
          size="large"
          color="green"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icon inverted size="large" name={open ? 'angle down' : 'angle up'} />
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

const colors = [
  '#FF6900',
  '#00D084',
  '#8ED1FC',
  '#0693E3',
  '#ABB8C3',
  '#EB144C',
  '#F78DA7',
  '#9900EF',
  '#FFFFFF',
  '#000000',
];

export default TextTweaker;
