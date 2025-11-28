<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false>
<div class="lumera-container">
  <div class="lumera-form-side">
    <div class="lumera-card">
      <!-- Logo -->
      <div class="lumera-header">
        <div class="lumera-logo">Luméra</div>
        <div class="lumera-subtitle">Beauty Academy</div>
      </div>

      <!-- Copy -->
      <div class="lumera-copy">
        <h1>Reset your password</h1>
        <p>Enter your email address and we'll send you instructions to reset your password.</p>
      </div>

      <!-- Error/Success message -->
      <#if message?has_content && (message.type = 'error' || message.type = 'warning')>
        <div class="lumera-alert lumera-alert-error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <#if message?has_content && message.type = 'success'>
        <div class="lumera-alert lumera-alert-success">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <#if message?has_content && message.type = 'info'>
        <div class="lumera-alert lumera-alert-info">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <!-- Reset form -->
      <form id="kc-reset-password-form" action="${url.loginAction}" method="post">
        <div class="lumera-field">
          <label for="username">Email Address</label>
          <input
            tabindex="1"
            type="text"
            id="username"
            name="username"
            autofocus
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <button tabindex="2" type="submit" class="lumera-btn primary">Send Reset Instructions</button>
      </form>

      <!-- Back to login -->
      <div class="lumera-register-link">
        Remember your password? <a href="${url.loginUrl}">Back to sign in</a>
      </div>
    </div>
  </div>

  <!-- Right side hero -->
  <div class="lumera-hero-side">
    <div class="lumera-hero-content">
      <h2>We've got you covered</h2>
      <p>Don't worry, it happens to the best of us. We'll help you get back to your learning journey in no time.</p>
    </div>
  </div>
</div>
</@layout.registrationLayout>
