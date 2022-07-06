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
   * @param {object} value  field value to be validated
   * @param {[object]} validations  validation rules for the field
   *
   * @returns {object} Returns boolean if field is Valid recursively and errortext
   */
  checkFieldValidity: (value, validations) => {
    let isValid = true,
      errorText = '';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        isValid = value.reduce(
          (acc, eleVal) =>
            acc &&
            validationFunctions.checkFieldValidity(eleVal, validations ?? [])
              .isValid,
          true
        );
      } else {
        isValid = Object.keys(value).reduce(
          (acc, key) =>
            acc &&
            validationFunctions.checkFieldValidity(
              value[key],
              validations[key] ?? []
            ).isValid,
          true
        );
      }
    } else {
      for (let validation of validations) {
        if (
          !validation.disabled &&
          !validationFunctions[validation.type](value, validation.value)
        ) {
          isValid = false;
          errorText = validation.message;
        }
      }
    }

    return { isValid, errorText };
  },

  /**
   * @param {object} form  form values to be validated
   * @param {[object]} validations  validation rules for the form
   *
   * @returns {boolean} Return true if form is Valid
   */
  checkFormValidity: (form, validations) => {
    let isValid = true;
    for (let key in form) {
      isValid &= validationFunctions.checkFieldValidity(
        form[key],
        validations[key] ?? []
      ).isValid;
    }
    return isValid;
  },
};

export default validationFunctions;
