import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("UPPER(games.title) like UPPER(:param)", { param: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(id) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = (await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "*")
      .where("games.id = :id", { id })
      .getOne()) as Game;

    return game.users;
  }
}