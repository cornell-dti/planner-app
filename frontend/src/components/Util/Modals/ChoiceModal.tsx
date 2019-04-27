import React, { ReactElement } from 'react';
import Modal from 'react-modal';

export type ChoiceObj = { readonly [key: string]: string };

/**
 * The type parameter Choice must be an object with predefined set of string keys and string values.
 */
export type ChoiceModalProps<Choices extends ChoiceObj> = {
  /**
   * Whether the modal is open.
   */
  readonly open: boolean;
  /**
   * The message displayed along with the choices.
   */
  readonly message: string;
  /**
   * All of the available choices in an object. It should be something like:
   * ```typescript
   * const choices = {
   *   choice1: 'User readable short description of option 1',
   *   choice2: 'User readable short description of option 2',
   *   // ...
   * };
   * ```
   */
  readonly choices: Choices;
  /**
   * The function called when a choice is picked.
   */
  readonly onChoicePick: (pickedChoice: keyof Choices) => void;
}

export default function ChoiceModal<Choices extends ChoiceObj>(
  { open, message, choices, onChoicePick }: ChoiceModalProps<Choices>,
): ReactElement {
  return (
    <Modal isOpen={open} contentLabel="Choice Dialog">
      <div>{message}</div>
      <div>
        {Object.keys(choices).map(key => (
          <button type="button" key={key} onClick={() => onChoicePick(key)}>
            {choices[key]}
          </button>
        ))}
      </div>
    </Modal>
  );
}