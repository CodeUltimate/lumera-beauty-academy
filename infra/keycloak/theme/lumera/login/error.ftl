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

      <!-- Error content -->
      <div class="lumera-copy">
        <h1>Something went wrong</h1>
        <p>We encountered an error processing your request.</p>
      </div>

      <!-- Error message -->
      <#if message?has_content>
        <div class="lumera-alert lumera-alert-error">${kcSanitize(message.summary)?no_esc}</div>
      </#if>

      <!-- Back link -->
      <#if client?? && client.baseUrl?has_content>
        <a href="${client.baseUrl}" class="lumera-btn primary">Return to Application</a>
      <#elseif skipLink??>
      <#else>
        <#if client?? && client.baseUrl?has_content>
          <a href="${client.baseUrl}" class="lumera-btn primary">Back</a>
        </#if>
      </#if>

      <div class="lumera-meta">
        If this problem persists, please contact support.
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
