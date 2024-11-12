import { LitElement, html, css } from "lit";

export class Project1Card extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      contentUrl: { type: String },
      sourceUrl: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 16px;
        background: #fff;
        width: 100%;
        max-width: 240px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      }

      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 8px;
      }

      h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: #333;
      }

      p {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #555;
      }

      a {
        display: block;
        font-size: 14px;
        color: #007acc;
        text-decoration: none;
        margin-top: 4px;
      }

      a:hover {
        text-decoration: underline;
      }
    `;
  }

  render() {
    return html`
      <div>
        ${this.image
          ? html`<img src="${this.image}" alt="${this.title}" />`
          : html`<div style="height: 150px; background-color: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center;">No Image</div>`}
        <h4>${this.title}</h4>
        <p>${this.description}</p>
        <a href="${this.contentUrl}" target="_blank">View Full Image</a>
        <a href="${this.sourceUrl}" target="_blank">Download</a>
      </div>
    `;
  }
}

customElements.define("project-1-card", Project1Card);