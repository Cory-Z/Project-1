import { LitElement, html, css } from "lit";

export class Project1Card extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      lastUpdated: { type: String },
      contentUrl: { type: String },
      sourceUrl: { type: String },
    };
  }

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.image = "";
    this.lastUpdated = "";
    this.contentUrl = "";
    this.sourceUrl = "";
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
        text-align: center;
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

      button {
        padding: 8px 12px;
        margin: 4px;
        font-size: 14px;
        background-color: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: #005fa3;
      }
    `;
  }

  openContent() {
    if (this.contentUrl) {
      window.open(this.contentUrl, "_blank");
    }
  }

  openSource() {
    if (this.sourceUrl) {
      window.open(this.sourceUrl, "_blank");
    }
  }

  render() {
    return html`
      <div>
        ${this.image ? html`<img src="${this.image}" alt="${this.title}" />` : null}
        <h4>${this.title}</h4>
        <p>${this.description}</p>
        <p>Last Updated: ${this.lastUpdated}</p>
        <button @click="${this.openContent}">Open Content</button>
        <button @click="${this.openSource}">Open Source</button>
      </div>
    `;
  }
}

customElements.define("project-1-card", Project1Card);