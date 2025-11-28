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

      <!-- Welcome copy -->
      <div class="lumera-copy">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey</p>
      </div>

      <!-- Error message -->
      <#if message?has_content && (message.type = 'error' || message.type = 'warning')>
        <div class="lumera-alert lumera-alert-error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <#if message?has_content && message.type = 'success'>
        <div class="lumera-alert lumera-alert-success">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <#if message?has_content && message.type = 'info'>
        <div class="lumera-alert lumera-alert-info">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <!-- Login form -->
      <form id="kc-form-login" action="${url.loginAction}" method="post">
        <div class="lumera-field">
          <label for="username">Email</label>
          <input
            tabindex="1"
            id="username"
            name="username"
            value="${(login.username!'')}"
            type="text"
            autofocus
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div class="lumera-field">
          <label for="password">Password</label>
          <input
            tabindex="2"
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        <div class="lumera-actions">
          <div class="lumera-forgot">
            <#if realm.resetPasswordAllowed>
              <a tabindex="3" href="${url.loginResetCredentialsUrl}">Forgot password?</a>
            </#if>
          </div>
        </div>

        <button tabindex="4" type="submit" class="lumera-btn primary">Sign In</button>
      </form>

      <!-- Social providers -->
      <#if realm.password && social.providers??>
        <div class="lumera-divider"><span>or continue with</span></div>
        <div class="lumera-social">
          <#list social.providers as p>
            <a class="lumera-social-btn" href="${p.loginUrl}">
              <#if p.iconClasses?has_content>
                <i class="${p.iconClasses}"></i>
              </#if>
              <span>${p.displayName}</span>
            </a>
          </#list>
        </div>
      </#if>

      <!-- Register link -->
      <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
        <div class="lumera-register-link">
          Don't have an account? <a href="${url.registrationUrl}">Create one</a>
        </div>
      </#if>

      <div class="lumera-meta">
        By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  </div>

  <!-- Right side hero -->
  <div class="lumera-hero-side">
    <div class="lumera-hero-content">
      <h2>Live. Learn. Elevate.</h2>
      <p>Join thousands of beauty professionals learning from world-class educators through live, interactive sessions.</p>
      <div class="lumera-hero-stats">
        <span>10,000+ Students</span>
        <span class="dot">•</span>
        <span>500+ Educators</span>
        <span class="dot">•</span>
        <span>50+ Countries</span>
      </div>
    </div>
  </div>
</div>
</@layout.registrationLayout>
