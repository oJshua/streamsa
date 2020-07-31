import { URL } from 'url';


export interface Identification {
  network: string;
}

export class UrlParser {

  static sanitize(url: string): string {
    return url.replace(/\/+$/, '');
  }

  public identify(url: string): Identification | boolean {
    let parser = new URL(url);
    let network = 'unknown';

    if (parser.hostname.match(/facebook\.com$/g)) {
      return this.facebook(parser);
    }

    return {
      network: network
    };
  }

  facebook(url: URL) {

    let id = null;

    let match = url.pathname.match(
      /^\/([\w\.]+)$/
    );

    if (url.pathname == '/profile.php' && url.searchParams.has('id')) {
      id = url.searchParams.get('id');
    } else if (match.length === 2) {
      id = match[1];
    } else {
      return false;
    }

    return {
      network: 'facebook',
      id: id
    };

  }

}
