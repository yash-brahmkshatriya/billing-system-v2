import React, { Component } from 'react';
import './standard-textarea.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import validationUtils from '../../../../utils/validationUtils';

class StandardTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputId: this.props.id,
      valid: false,
      errorText: '',
      dirty: false,
      showPassword: false,
    };
  }

  componentDidMount() {
    this.checkValidatity(this.props.value);
  }
  getStandardInputClass = () => {
    const { disabled, className } = this.props;
    return classNames('standard-textarea', 'position-relative', 'form-group', {
      disabled: disabled,
      [className]: className,
      error: (this.state.dirty || this.props.showError) && !this.state.valid,
    });
  };

  getInputClassName = () => {
    const { error, inputClasses } = this.props;
    return classNames('form-control', {
      error: error,
      [inputClasses]: inputClasses,
      'has-feedback': this.props.type === 'password',
      'after-icon': this.props.afterIcon,
    });
  };

  renderLabel = () => {
    const { inputId } = this.state;
    const { label } = this.props;

    if (label) {
      return <label htmlFor={inputId}>{label}</label>;
    }
    return null;
  };

  renderHelp = () => {
    const { helpText } = this.props;

    if (helpText) {
      return <p className='help-text mb-0 mt-2'>{helpText}</p>;
    }
    return null;
  };

  renderError = () => {
    const { errorText } = this.state;

    if (errorText && (this.state.dirty || this.props.showError)) {
      return <p className='error-text mb-0 mt-2'>{errorText}</p>;
    }
    return null;
  };

  checkValidatity = (value) => {
    let isValid = true;
    let errorText = '';
    for (let validation of this.props.validations || []) {
      if (
        !validation.disabled &&
        !validationUtils[validation.type](value, validation.value)
      ) {
        errorText = validation.message;
        isValid = false;
        break;
      }
    }
    this.setState({
      valid: isValid,
      errorText: errorText,
    });
  };

  onChange = (e) => {
    this.checkValidatity(e.target.value);
    this.props.onChange(e);
  };

  onBlur = () => {
    this.setState({
      dirty: true,
    });
  };

  toggleShowPassword = () => {
    this.setState((state, props) => ({
      showPassword: !state.showPassword,
    }));
  };

  render() {
    const { inputId } = this.state;
    const { placeholder, disabled, value, rows } = this.props;

    return (
      <div className={this.getStandardInputClass()}>
        {this.renderLabel()}
        <textarea
          className={this.getInputClassName()}
          id={inputId}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyUp={this.props.onKeyUp}
          onKeyPress={this.props.onKeyPress}
          onKeyDown={this.props.onKeyDown}
          pattern={this.props.pattern}
          inputMode={this.props.inputmode}
          formNoValidate={false}
          onPaste={this.props.onPaste}
          rows={rows}
        />
        {this.state.valid ? this.renderHelp() : this.renderError()}
      </div>
    );
  }
}

StandardTextarea.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  error: PropTypes.bool,
  rows: PropTypes.number,
};

StandardTextarea.defaultProps = {
  type: 'text',
  disabled: false,
  error: false,
  placeholder: '',
  value: '',
  rows: 2,
};

export default StandardTextarea;
