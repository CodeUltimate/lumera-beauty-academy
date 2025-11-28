<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false>
<div class="lumera-container">
  <!-- Left side hero -->
  <div class="lumera-hero-side">
    <div class="lumera-hero-content">
      <h2>Start Your Journey</h2>
      <p>Whether you want to learn from the best or share your expertise with the world, Luméra is your platform for growth.</p>
      <div class="lumera-hero-features">
        <div class="lumera-feature">
          <span class="lumera-check">&#10003;</span>
          <span>Access to live masterclasses</span>
        </div>
        <div class="lumera-feature">
          <span class="lumera-check">&#10003;</span>
          <span>Verified certificates</span>
        </div>
        <div class="lumera-feature">
          <span class="lumera-check">&#10003;</span>
          <span>Global community access</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Right side form -->
  <div class="lumera-form-side">
    <div class="lumera-card">
      <!-- Logo -->
      <div class="lumera-header">
        <div class="lumera-logo">Luméra</div>
        <div class="lumera-subtitle">Beauty Academy</div>
      </div>

      <!-- Welcome copy -->
      <div class="lumera-copy">
        <h1>Create your account</h1>
        <p>Join the premier beauty education platform</p>
      </div>

      <!-- Error message -->
      <#if message?has_content && (message.type = 'error' || message.type = 'warning')>
        <div class="lumera-alert lumera-alert-error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <#if message?has_content && message.type = 'success'>
        <div class="lumera-alert lumera-alert-success">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <!-- Registration form -->
      <form id="kc-register-form" action="${url.registrationAction}" method="post">
        <div class="lumera-field">
          <label for="firstName">First Name</label>
          <input
            tabindex="1"
            type="text"
            id="firstName"
            name="firstName"
            value="${(register.formData.firstName!'')}"
            autocomplete="given-name"
            placeholder="Enter your first name"
          />
        </div>

        <div class="lumera-field">
          <label for="lastName">Last Name</label>
          <input
            tabindex="2"
            type="text"
            id="lastName"
            name="lastName"
            value="${(register.formData.lastName!'')}"
            autocomplete="family-name"
            placeholder="Enter your last name"
          />
        </div>

        <div class="lumera-field">
          <label for="email">Email Address</label>
          <input
            tabindex="3"
            type="email"
            id="email"
            name="email"
            value="${(register.formData.email!'')}"
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <#if !realm.registrationEmailAsUsername>
          <div class="lumera-field">
            <label for="username">Username</label>
            <input
              tabindex="4"
              type="text"
              id="username"
              name="username"
              value="${(register.formData.username!'')}"
              autocomplete="username"
              placeholder="Choose a username"
            />
          </div>
        </#if>

        <#if passwordRequired??>
          <div class="lumera-field">
            <label for="password">Password</label>
            <input
              tabindex="5"
              type="password"
              id="password"
              name="password"
              autocomplete="new-password"
              placeholder="Create a password"
            />
            <span class="lumera-field-hint">Minimum 8 characters with upper, lower, and number</span>
          </div>

          <div class="lumera-field">
            <label for="password-confirm">Confirm Password</label>
            <input
              tabindex="6"
              type="password"
              id="password-confirm"
              name="password-confirm"
              autocomplete="new-password"
              placeholder="Confirm your password"
            />
          </div>
        </#if>

        <#if recaptchaRequired??>
          <div class="lumera-field">
            <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}"></div>
          </div>
        </#if>

        <div class="lumera-terms-notice">
          By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>

        <button tabindex="7" type="submit" class="lumera-btn primary">Create Account</button>
      </form>

      <!-- Login link -->
      <div class="lumera-register-link">
        Already have an account? <a href="${url.loginUrl}">Sign in</a>
      </div>
    </div>
  </div>
</div>
</@layout.registrationLayout>
