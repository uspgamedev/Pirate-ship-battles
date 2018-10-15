////////////////////////////////////////////////////////////////////////////////
//                            Pirate Ship Battles                             //
//                                                                            //
//                        Tests - Server - Score Board                        //
////////////////////////////////////////////////////////////////////////////////

const ScoreBoard = require('../../objects/score_board.js');

////////////////////////////////////////////////////////////////////////////////
test('objects/score_board: class Score_Board - constructor', () => {
  let p = new ScoreBoard();

  expect(new ScoreBoard()).toBeInstanceOf(ScoreBoard);
  expect(p.score_list).toEqual({});
});

////////////////////////////////////////////////////////////////////////////////
test('objects/score_board: add_player()', () => {
  let p = new ScoreBoard();

  p.add_player(1);
  expect(p.score_list).not.toEqual({});
  expect(p.score_list[1]).toBe(0);
});

////////////////////////////////////////////////////////////////////////////////
test('objects/score_board: remove_player()', () => {
  let p = new ScoreBoard();

  p.add_player(1); //Add a player
  expect(p.score_list[1]).toBeDefined();
  p.remove_player(1);
  expect(p.score_list[1]).toBeUndefined();
});

////////////////////////////////////////////////////////////////////////////////
test('objects/score_board: update_score()', () => {
  let p = new ScoreBoard();

  p.add_player(1); //Add a player
  p.update_score(1);
  expect(p.score_list[1]).toBe(1);
});
