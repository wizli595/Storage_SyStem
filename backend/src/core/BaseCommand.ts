export default abstract class BaseCommand {
  abstract name: string;
  abstract description: string;
  abstract execute(): void;

  protected log(message: string) {
    console.log(message);
  }
}
