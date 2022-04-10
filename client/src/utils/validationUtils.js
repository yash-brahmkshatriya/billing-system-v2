var validationFunctions = {
  /**
   * @param {value} value the value that needs to be tested.
   * @param {value} length allowed length of the string.
   *
   * Returns true/false based on if the value length is not more than specified length.
   */
  MaxLength: (value, length) => {
    return length >= value.length;
  },

  /**
   * @param {value} value the value that needs to be tested.
   * @param {value} min minimum value allowed.
   */
  Min: (value, min) => {
    if (!value) {
      return true;
    }
    return value >= min;
  },

  /**
   * @param {value} value the value that needs to be tested.
   * @param {value} max maximum value allowed.
   */
  Max: (value, max) => {
    if (!value) {
      return true;
    }
    return value <= max;
  },

  /**
   * @param {value} value the value that needs to be tested.
   *
   * Returns true/false based on if the value is not null, undefined and empty string.
   */
  Required: (value) => {
    return (
      value !== undefined && value !== null && value.toString().trim() !== ''
    );
  },

  /**
   * @param {value} value the value that needs to be tested.
   * @param {value} regex regular expression that the value should satisfy.
   *
   * Returns true/false based on if the value passed the regular expression test or not.
   */
  Pattern: (value, regex) => {
    if (!value) {
      return true;
    }
    return regex.test(value);
  },

  /**
   * @param {value} value the value that needs to be tested.
   * @param {value}  comparisonValue expression that the value should satisfy.
   *
   * Returns true/false based on if the value is same as comparisonValue.
   */

  CompareValue: (value, comparisonValue) => {
    return value === comparisonValue;
  },

  /**
   * @param {object} form  form values to be validated
   * @param {[object]} validations  validation rules for the form
   *
   * @returns {boolean} Return true if form is Valid
   */
  checkFormValidity: (form, validations) => {
    for (let key in form) {
      for (let validation of validations[key] || []) {
        if (
          !validation.disabled &&
          !validationFunctions[validation.type](form[key], validation.value)
        ) {
          return false;
        }
      }
    }
    return true;
  },
};

export default validationFunctions;
