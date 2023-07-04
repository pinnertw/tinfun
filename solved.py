import json
challenge = json.load(open("challenge.json"))

metadata = []
for layer in challenge["data"]["layer"]:
    for mahjong in challenge["data"]["layer"][layer]:
        metadata.append([mahjong["layer_num"], mahjong["rol_num"], mahjong["row_num"], mahjong["type"]])
metadata.sort(key = lambda x: x[0], reverse=True)
metadata = [metadata[i] + [i] for i in range(len(metadata))]

def check_intersect(data, index_1, index_2):
    return abs(data[index_1][1] - data[index_2][1]) < 8 and abs(data[index_1][2] - data[index_2][2]) < 8

def get_layer(data, index_1):
    num = 0
    for index_2 in range(len(data)):
        if index_2 == index_1:
            continue
        if check_intersect(data, index_1, index_2) and data[index_2][0] > data[index_1][0]:
            num += 1
    return num

def get_aboves(data, index_1):
    aboves = []
    for index_2 in range(len(data)):
        if index_2 == index_1:
            continue
        if check_intersect(data, index_1, index_2) and data[index_2][0] > data[index_1][0]:
            aboves.append(index_2)
    return aboves

def get_can_picks(data, holding, max_layer=0):
    can_picks = [[] for i in range(max_layer + 1)]
    for i in range(len(data)):
        layer_count = get_layer(data, i)
        if layer_count <= max_layer:
            can_picks[layer_count].append(data[i])
    return can_picks

def count_in_holding(metadata, holding, type_):
    num = 0
    for index in holding:
        if metadata[index][3] == type_:
            num += 1
    return num

def dp(data, holding):
    if len(data) + len(holding) < 15:
        return True, data 
    else:
        can_picks = get_can_picks(data, holding, max_layer = 0)
        for layer in can_picks:
            for item in layer:
                cnt_holding = count_in_holding(metadata, holding, item[3])
                if cnt_holding < 2 and len(holding) == 6:
                    continue
                elif cnt_holding == 2:
                    new_holding = [index for index in holding if metadata[index][3] != item[3]]
                else:
                    new_holding = holding[:] + [item[4]]
                ability, step = dp(
                    [elem for elem in data if elem[4] != item[4]], 
                    new_holding
                )
                if ability:
                    return True, [item] + step
        return False, []
    return
import sys
print(len(metadata), file=sys.stderr, flush=True)
print('toClicks=' + str(dp(metadata.copy(), [])[1]) + ';')
print('''
function randomExponential() {
    return 1000 + 2000 * -Math.log(Math.random());
}

async function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function clickAuto(index) {
  try {
    layer = toClicks[index][0];
    col = toClicks[index][1];
    row = toClicks[index][2];
    document.querySelector(`img[alt="Layer emoji${layer}-${col}-${row}"]`).click();
  }
  catch {
    console.log(index, toClicks[index]);
  }
}

(async() => {
  for (let i = 0; i < toClicks.length; i++) {
    await delay(randomExponential());
    clickAuto(i);
  }
})()
''')
print("Done!", file=sys.stderr, flush=True)
