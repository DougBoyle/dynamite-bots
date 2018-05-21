from collections import namedtuple
import json
import requests
import sys

BOTS_URL = "https://dynamite.softwire.com/api/bots"
PLAY_URL = "https://dynamite.softwire.com/api/play"

Bot = namedtuple('Bot', ['name', 'id'])

def get_all_bots():
    bots = json.loads(requests.get(BOTS_URL).text)
    return map(lambda x: Bot(name=x["name"], id=x["id"]), bots)

def get_match_result(bot_1, bot_2):
    result = requests.post(PLAY_URL, data = {"botId1": bot_1.id, "botId2": bot_2.id})
    parsed_result = json.loads(result.text)
    return parsed_result["bot1score"], parsed_result["bot2score"]

def play_games(bot_1, bot_2, iterations):
    print
    print "Playing {0} matches of {1} against {2}".format(iterations, bot_1.name, bot_2.name)
    bot_1_wins, bot_2_wins, points_difference = 0, 0, 0
    for _ in xrange(iterations):
        bot_1_score, bot_2_score = get_match_result(bot_1, bot_2)
        print "{0}-{1}".format(bot_1_score, bot_2_score)
        points_difference += bot_1_score - bot_2_score
        if bot_1_score > bot_2_score: bot_1_wins += 1
        if bot_2_score > bot_1_score: bot_2_wins += 1

    print "Result: {0}-{1}".format(bot_1_wins, bot_2_wins)
    print "Points difference: {0} (avg. {1})".format(points_difference, points_difference / iterations)
    print

def main():
    iterations = int(sys.argv[1])
    my_bot_name = sys.argv[2]
    other_bot_names = sys.argv[3:]

    def should_play(bot):
        return bot.name in other_bot_names or (len(other_bot_names) == 0 and bot.name != my_bot_name)

    all_bots = get_all_bots()
    my_bot = [bot for bot in all_bots if bot.name == my_bot_name][0]
    for other_bot in [bot for bot in all_bots if should_play(bot)]:
        while True:
            try:
                play_games(my_bot, other_bot, iterations)
                break
            except KeyboardInterrupt:
                raise
            except:
                print "Little bit of an error! Trying again..."

if __name__ == "__main__":
    main()