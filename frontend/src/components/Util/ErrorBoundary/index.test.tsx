import React, { ReactElement } from 'react';
import renderer from 'react-test-renderer';
import ErrorBoundary from '.';

const BrokenComponent = (): ReactElement => {
  throw new Error('Ah');
};

it('ErrorBoundary can catch error and render', () => {
  // @ts-expect-error: we want to simulate production error page.
  process.env.NODE_ENV = 'production';
  const tree = renderer
    .create(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
