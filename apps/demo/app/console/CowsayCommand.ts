import { BaseCommand, args } from "@recompose/ace";
import cowsay from "cowsay";

export default class CowsayCommand extends BaseCommand {
  static commandName = "cowsay";
  static description = "Display a cowsay!";

  @args.string()
  declare text: string;

  async run() {
    console.log(
      cowsay.say({
        text: `Hello from Ace CLI! 🐮 ${this.text}`,
      }),
    );
  }
}
