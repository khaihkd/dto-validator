const express = require('express')
const router = express.Router()
const Web3Utils = require('../helpers/web3')
const airdropDistribution = require('../contracts/airdropDistribution.json')
const { check, validationResult, query } = require('express-validator')
require('dotenv').config()
const BigNumber = require('bignumber.js')

BigNumber.config({ EXPONENTIAL_AT: [-100, 100] })
let airdropList = {
    "0x68aaec8a99828661e35ccd3ce0123881a6cceccc": 500,
    "0x1c574dbafa8fe66b0b8d3c38eeba7b44b14ab70d": 500,
    "0x9b47fb837b5b4f7edab075f0d932c4154ef4ddca": 200,
    "0xb9127f69bee7c5ed4e6290b16c666fcff65c8be7": 200,
    "0xc474242ed21ce34ff26077335f573a75e9f24806": 200,
    "0x518571677670505e3a2824fec0ffdd9b0d888888": 200,
    "0x5b5d3da0f560a7a86f87377ba6acebfde0c000b3": 200,
    "0xc2791f880f339d4d7d7208f76a9a55d542bac016": 200,
    "0x2d26388af43ec47ff7c486fd5f76e27e98b10a50": 200,
    "0xd60a4ce69001d11f3435d4444f9bd0aaec614020": 200,
    "0x948585f3dfb6c58c6b5704579bc244f27dc325f6": 200,
    "0xdd4ffec5e435bee65ca5d411502351f8385c33ba": 200,
    "0xe460dbacda50da862fbf4bfa1276d34ac71f86e4": 200,
    "0xa2dfc8895e40eafcc4f2eef9ba18fe116f5f2640": 200,
    "0x4e4b9ca67ec4de1ceaaf9a9929b83c731adcebbf": 200,
    "0x67ae8339dabac4bdac489629f37820b06fd1eb26": 200,
    "0x6f99bba5d425f93f0c0b6b3a9f3a818ec60472ec": 200,
    "0x8b9c58b4ddc8a02f9263f613cdf61f9cab06e248": 200,
    "0xcb868d3168cbb104c8dcce1f4d1ec36ffa4d888c": 200,
    "0x27561111bb09d76368343a9c85339db43d28fc7d": 200,
    "0x3908cd6c9d1b7fc56470bf7d1acdacd0542a3b8c": 200,
    "0x325daf2c2c9cef8ecd799948b85c8d84de0b9c5b": 200,
    "0x465ac963ef750a86af0f51b773489ecdcab260fb": 200,
    "0x8f2ee979d4275d7345e66490f71e25fa156eaab6": 200,
    "0x07a0cbe5c6f2a666336225f8b0f4bfa93e690787": 200,
    "0x90c0a1ffb765daa50ba72c6aa2134f7132776082": 200,
    "0x5bd8df88bc7b9f248a04249f888cd581ab57752c": 200,
    "0xca8e0e8e631a70a9d71b3d1b8322f4d26219e659": 200,
    "0xe388d937f1f5cf74f772b9efecd33fbe44b31509": 200,
    "0xc3cdc38216a7a52ddd127c67c2c182af4fffd7d3": 200,
    "0x84e3ac866957de6666695f6808c8be4f68105c0a": 200,
    "0xa10510064fb47f8cafe90b7c325e66b1f0b0281d": 200,
    "0x13ac03300a65133e47c0758a1e0269552395f598": 200,
    "0x08641f45f84da7cd8393d7044aba7ea513727db6": 200,
    "0xa993342ed6dbbf2836f53bd274f0ab6697c0ae5e": 200,
    "0xa07ae7fdb4cab8a464140a3414448dcf0e4c98db": 200,
    "0x815aed3e53d6c16a48eb226256ddb6cee58251e6": 200,
    "0xc2dfe2476b0f13fe051d6142df74f83b8acca3c0": 200,
    "0x610be1011a1c9f75b17d9d0bb4eadd06d5ec99e9": 200,
    "0x80dbb857ba00086fffca9c9ebe4c32823b77a288": 200,
    "0x03c4d114b7f0444c5a7384365abf28fd22c3b748": 200,
    "0x79dd15d740688b70c7fffeac3b09833f21929927": 200,
    "0x3b99bf18de5a67b4309fade40633d19be541a26f": 200,
    "0x48696c37193a99c2f37cc5d37b06723a078dd74c": 200,
    "0x39084cf1a8ed98986e2175dbdc9f65581e064c13": 200,
    "0x65316839965df75420f7485333ca5eb363d909e4": 200,
    "0x2329e1cec8bd3a475fccad6643fa17663b69ca66": 200,
    "0x82255a84194452bbbdfa97e092ff1a283fc0de92": 200,
    "0x0cb7beae34dc8b14f4036444b96c7d19cde610bf": 200,
    "0xab5610017b483d1522a449d945af9f7ceae2d45d": 200,
    "0x82f3e8e1f696abd02181ffc898a869e5f9f6a727": 200,
    "0x124e6ebd3a8f8f717bdd766b299ad3cb18dbbee7": 200,
    "0x18f6511d79d6cd5850075eb30f0450e6b2d10593": 50,
    "0xa6aaaa2bced0c3394fa0a4b91a1d091b0b7827ce": 50,
    "0x07a308002d862bbef4178d9a9b3991df71940f79": 50,
    "0x73252c6c0d2585289722881cd0ebf3310d889839": 50,
    "0x46a367dc46acc986f515f44e1c771ef6be505a3a": 50,
    "0x3b4396ac07977c3abf6b0f5f423b458b3edc846c": 50,
    "0x37e8b07ff9f605c02eadae6e780439c421394947": 50,
    "0x62636cae2035bba7eb7f757231294a44f74ef351": 50,
    "0x4143c3eeb72982552cf91d3aef2fb913f95d18ff": 50,
    "0x61dc6367f86b5baa3aa208a7f85efc7bff731afb": 50,
    "0xc9e5dc9d7170119643b39a89d91a4c5fb2356815": 50,
    "0xaeb871d88d6150bab222620d0378886421512161": 50,
    "0x6567e7b39bc0a64c23624dbe902077785d74a1a5": 50,
    "0x745da87b8658d5eb698453ef2e98af87d745c3a8": 50,
    "0xbc82ac68382e241bddfb89d19b76bc15b4bfe526": 50,
    "0xed980b06330ec5f32c2d7dc3c508b1b1c6ca056c": 50,
    "0x7b4967b58af5f9af7a4f876f5023ab96ac496603": 50,
    "0xb2e3e1c4b8e830cbf5a800399fd7a8542058c4f5": 50,
    "0x651e5ea3e106c2a05e90611b1847c433d843ab43": 50,
    "0xb36df40724dce2d3e7377eb06e98bbd262f2c360": 50,
    "0x0ad03c2b62e0e335d6ded60c4a746a1ac20dcd7c": 50,
    "0x25d657d1eb4bab110d17e7e25ee68d1df2481c15": 50,
    "0xe1f63754968002cccde2d6fe11c8a456a8593ec3": 50,
    "0x67e361f900b3d6d66a25af62058fb8baa68bf3da": 50,
    "0x72fb1e89fdacca4a34cdcc1963fa23040a6f5ea7": 50,
    "0xad88e1c7b33e5d72970adddba1ba92aab83742a4": 50,
    "0x5931d2d1c9fcfbff583493b3e2e17c382c898e49": 50,
    "0xee48234c8a45ab5e08577a75eb9565d103b4dc3b": 50,
    "0x4a7b8d2dad86d719c266eba09cbbd8e942e84362": 35,
    "0x21f7d334610faa7ed1f2eb194993c5efad733173": 50,
    "0x24313143fdc9cf228727072e06f0ffe54266e5c3": 35,
    "0xe92e45e40efe32473c7434e860bbb4e5fb80c3d4": 50,
    "0xb700466146b07e62ff081764590d8898e9de60fd": 50,
    "0x23c7651f5e0a17739b7c8893783df44b21f47e9d": 50,
    "0x552ea3444b1a464bf844b0168e382ac3e71ad903": 50,
    "0xd2e707a157db6aab6600055ab3f34fed377aacbd": 50,
    "0x7ece17b169630356fef774c99d1869adce807379": 50,
    "0xe1baa1452cf792ee69eb53eda057f327fa572b0c": 50,
    "0x8346edcaa516e3e5d8917e0af5f653ac6dca22c3": 50,
    "0xd51da5804e2b65b3ea819d4a1de62ccbb6336521": 50,
    "0x17b12a068bbf75053b8108f73ba6adef9cc178ab": 50,
    "0xcb66a36f5847f0f1b21ac0e39779172159b0e8fe": 50,
    "0xfc5918a6c8344c512a84fe057cef224f1e034b3e": 50,
    "0xbabf7ee8a420202197dcb6060555a67ffee7f7a6": 50,
    "0x2b659da390f1c986537ed317fa305012a3809dc2": 50,
    "0x86057d861e2508de11782b2831ce7e4d78f62ca4": 50,
    "0x0b7b92e458359a83081471ce09b3484ff52e0e0e": 50,
    "0x611cc2674574d881416dba65667d205404771ed7": 50,
    "0xbfaeb14d75b59c0127d7b250598f5ff54e533572": 50,
    "0x4be0fda4c532dfe15f22ed68fde42c0893527478": 50,
    "0x94aa12aa9bbbed60748d1a3db1ff83e077c54555": 50,
    "0x9ec5aa82aeb21d1f6d65b4965e5ebf30821506dc": 50,
    "0xb7f2e9d4b0e1757404980269e13f91c097ef2ef4": 50,
    "0xd62e936c84e6196e5b37fedb8e34e9843256afb0": 50,
    "0xd793a983c6ec4d856c34c344be12869ad218a08f": 50,
    "0xd7288fda1926f726115f5390ddbe8fad5148d299": 50,
    "0x577a3a58dba3b9d68ab6214bdfc8c22c49d85f07": 50,
    "0xdb02e73880622aa985842309091b3f1be3c6ed0b": 35,
    "0xfcce155c67dd3c7794aa9679704affe6b8c5140e": 50,
    "0xc8f785316117abec50184f740a6677f4e348d757": 50,
    "0x5daf505aad2c35d80d4b7afe9b6e83fe52949957": 50,
    "0x1bdd9b0d0902f2a9779233f08a11cc078b6e8da5": 50,
    "0xfd0a1f0dbbf6a18a841ed95e2e9f0b6144efb7e9": 50,
    "0x0f4c17335cc05cb29336b69eea7a4bc9c6389fd0": 50,
    "0xb483c177e4f41217c02de8b7702c5670dfc93f5c": 50,
    "0x7e5e8574357d99435a4b97bcd5c79c4115f0727b": 50,
    "0xffbd1f9907584596dd352846586401b25310d0c7": 50,
    "0x9c391502c3d0686596b90ab38f9f695a7e3eab83": 50,
    "0xb47bbfe202104d00cd90590f91732bde4a73c1ae": 50,
    "0x383b552373d27a151cbd5c9c6e2bc728029011f2": 50,
    "0xa2f376328f8231a80dc302b0b2593201bd56d043": 50,
    "0xa0dfbc88c64ab4ed751d0983c50538c79e5faad2": 50,
    "0x1ee09d1fbd8464948e561d8594f8689dba3f1bff": 50,
    "0x70e5b02205a89c97b73f16adefbcabbc2e788fce": 50,
    "0xa2a40bf965017e02fd97b9dd3a0f870f8b3a2eca": 35,
    "0x20e95c57bf864e353836f80a64f8639b32c54036": 50,
    "0x22255b9c0b7c2f992ab9c2d65de2f0673f8c63f8": 50,
    "0xbf0532787f0b4e8c33f521ac4e16abedd5b7aba0": 50,
    "0x5f54a023a1360d814143d9f7cfad8a4599f1cb88": 50,
    "0x726719dd1d3f316b876f927264610b0f766f0040": 50,
    "0x58e02659050f384df359d41bae465b36983880e3": 50,
    "0xac0517844411eacc3e0a8921637156c18f0efec7": 50,
    "0x4b5a75999d4c71691fa9fd223620f09f7bcd1a9a": 50,
    "0x1461a6ebb0554f3c39246c9c8629dedafb706e5b": 50,
    "0x8d2d46cdb8466a2eda04d81ef4186dc2ea0b6820": 50,
    "0x5398fce040a8b804d029eeb4ef40a13fac07402b": 50,
    "0xb364abad6502ad68788dc3d5741e1f67ed35ee54": 50,
    "0x9578bc4908ae41a6cb81d0b5d0ad23098bbee357": 50,
    "0x7fa1592007d56f74c1998f7a8b647e892530a628": 50,
    "0x0d1024b2055d6b39067c48b5c2a178724929429e": 50,
    "0x5e7114dda9df515d88a7e362b8971f3587f4a7b7": 50,
    "0x1c691c7df8b266e6ef9e2c3acff618b0331084d3": 50,
    "0x2918c815ebba337a078d6a2562e0cf36f434bb17": 50,
    "0x60cc6440d1615b92c323b33417f95682e9c99439": 50,
    "0xfc00592b3110da40b821c26a7ed01fb8f84d6966": 50,
    "0x336281fb9c796e9c73b26f37c3ee607ffee0a69c": 50,
    "0xfe00402272678c7e6f1eb2290acab30e2e7dc2b1": 50,
    "0xd57e463bd4c0d5e672a9531ddb914e5e0a7c9b8f": 50,
    "0x97a45158ba056ea9ecf683098f7dcb60885adeef": 50,
    "0x9a4a4d0479612b05e763c67ef3dcd9ffbc3562ab": 50,
    "0x28397143555f7cd806469926272e063a2aac5c90": 50,
    "0x06802c6fa4f2b55cabeffab926d741339ebbeebb": 50,
    "0x4cdde5797b83c6f3a99a15735dd39ecd1577e6de": 50,
    "0x2cffbd9e449b898e409f5a37ff096201bf97830a": 50,
    "0x352f5b183a654a5c956d297abc653fc1917b46d5": 50,
    "0x1af15965f2d3c7024ce83b9500fbf44c1250d30c": 50,
    "0x9205aa7bf5f312b90d15d0a2754fe93715ca13af": 50,
    "0x56a6ae71a9a519fd09802183a693dde34f9b626b": 50,
    "0xa1e34f0e095233f505e7b128ede35ae05a72587e": 50,
    "0xaa4399997f3718fbe8872f4759cbf00cf272f870": 50,
    "0x7c7eef52d70359123dec84e68972ead2985dc232": 50,
    "0x226efdb355e83fa47048c0d6454fc71c729ec880": 50,
    "0x5f71961deb6fc2cacdc345d8c5b337bf2d8a049c": 50,
    "0x1dea26d6d54dbf9a5fd09d7fc4746f1c5dbb2c09": 50,
    "0x3b24a6288fbe960a9a76c5846f591e25f8bcf270": 50,
    "0xe61562c1dd02ff79442a0990d4ff37f4e61eb02d": 50,
    "0x3f6d5384d8b4b4535821cf88fabe007bd2fcc6e6": 50,
    "0xc1b9a80fbae663f6b8ba591b44b6685da7982182": 50,
    "0x91728358b663a00c91a30127e47ce3a7902ad2fc": 50,
    "0x3c53f304dcd45ca7e77472f2b818c1d28b7afe0b": 50,
    "0x654eba2bede757a2e16d829772bc5f9d42ac0357": 50,
    "0x948ed782a8e1273a7470291aea6e395db0f85fe6": 50,
    "0x1280b05112f15a1d5dde737c97814b754f92a054": 50,
    "0x2c352b3f8486c380f2c8577f27409f5f01992562": 50,
    "0x686257cb60a2260c9952c462e84ad7df68f03711": 50,
    "0xa072b1d11c7ad3cdc1b883f03feab2c6b98a0336": 50,
    "0x38ce9585eb7ab373ae77e0c2bbe1375e17ea2cfd": 50,
    "0x27f76fa4929927b9a183d8d54adf0d146eda1723": 50,
    "0x1069c1f975e15ea09461f6f1911bbbf45b851d77": 50,
    "0x850e7654f0f8e11703aa5b1281ee4c9366f42fdd": 35,
    "0xc80bad4c402fae41113189d47628face30f84eb6": 50,
    "0x6c05ceeebcbeaf7e119fba3a816b4c53d3fdfdb4": 50,
    "0xf01310c249a4634ac579474906c961388f55c231": 50,
    "0x2a476749cbcf05cdf1998023808355da5d8eed01": 50,
    "0xdf039ea4bcb25a11b3741ded0dcc8044d1e55b79": 35,
    "0xd20d9c2ac8c8f3b3b9c072355e526bae8ee71452": 50,
    "0x08d56dba5dc321ce38a1fbd88ed450923f8fa63d": 50,
    "0x2f7b5eb10ee20e48ef591625a51d1ee2bb90cab5": 50,
    "0x0d5fbd5f43253a1eb9ea92867f6aa7658f4fce3f": 50,
    "0xfa974c4dd049b8e20e0f5e0597d90c9ebd0c2817": 50,
    "0x086a82d7d9872fae3b1beee2571cb5a7d9570921": 50,
    "0x85ff5e4ec2d82192f97da7a2c877a06475f9c028": 50,
    "0xcbcf9f61b5dddfe7aa14369cb4494b6589d6912a": 50,
    "0x7c9c36e97aece8a7214e43dbfc7dc50f8b1feb71": 50,
    "0x172a40506f125a3fcaaaa40322fa1a46ee8986a3": 50,
    "0x7d4b71ba29f887181c26b724ee51a9664ba3bf48": 50,
    "0xa8b40c7de21cc1b5e15cf41045fca90f08e1895d": 50,
    "0xa36eb3d8d8066b1887a6b3834cc9a2fecdc21210": 50,
    "0x6152ecf2ac08e546681120bfcfd19a21155c32e2": 50,
    "0xbc5a00521f431c549066990ad3f6331fc5c2bd24": 50,
    "0xac2eae697a1e558bb6541ff31d09b5677f8b0cbe": 50,
    "0xc1f6ea48c0ee69a74df395b5421f0fa856870b5e": 50,
    "0x06963cc742142e2702afc03ac599c4d1cdcc64fc": 50,
    "0xbe5d5878de4474d4b5d7fc763fd9690bf67c72b0": 50,
    "0x3a825068c33c94b464594e555bab8dc617851bef": 50,
    "0x8810c0d6f468e8f746c8ee9b73da53aea4323547": 35,
    "0x2a25684cbf3c2efd46b857f1446a6d8379e06c59": 50,
    "0x14499840f74d3f11bebe7544f9e5443e366fbfc3": 50,
    "0x2950ba5524e5a5096093e612037386ee7b263613": 50,
    "0x8108140ea03372f70872c4dd0845e3bd3736640f": 50,
    "0x1393ed932a43316c5e7ccb8bef04ac0e26908d39": 50,
    "0xd74b9988712af220715aef907237faa4f8a137e9": 50,
    "0x7615e542792d88aad255540e0900fd82bb390151": 35,
    "0x90897165b8a3c664c0897a7e02f4145262acf530": 50,
    "0x9fc2df8d394a77c76d767661445a09b1ff42181e": 50,
    "0xc2b2f6d03bb459698dced51122dfd80b62e7bd7f": 50,
    "0x124102938bc9abc45d2b14b32451efc249a10c36": 50,
    "0xebcb2e3fbcf1ca700273394b7469e99b3b053500": 50,
    "0x248d8880c4fb41cabfd3b1a4dd2a71560367cc07": 50,
    "0xb1367a4a914cd99cba28e8004c9db606f1a65dbc": 50,
    "0x3c1f0c6056e7da3fd6dee97f850d4b82fda3daee": 50,
    "0x98b28269795fcf65fddcabd6ccdc28e1cd4af751": 50,
    "0xc60d7dea2a2c3591c83770fca2fa334d0c4e60c7": 50,
    "0x6886d86b1f333fce111e936d7788e639633568b2": 50,
    "0xd03942f55e3292bb3b1e19930aeb3a4895d0f574": 50,
    "0x20fe4ba568948b7822e21738863852c78735b761": 50,
    "0x75cfbee838f6d77414f07b4b8c3c80cbaedbee7e": 50,
    "0x290b5514367e7b6be1d982d91ca1478604d09e63": 50,
    "0xb96d7f84d20cf12fc66cebbc4d2835c8a99c3c40": 50,
    "0xef3301e8221f85fbad498aee8add7f1d9ea29cbc": 50,
    "0xd0ebe3c50c2b12f224cc7597317eb869406f3906": 50,
    "0x5634eadd395d093875e603242a39cdd1efa1e8f7": 50,
    "0x0d6791056bb293616d135df6e3544faf3a92ca23": 50,
    "0x275ecc2caac3a1164d806a145d919d8f47009dae": 50,
    "0xb8fdeb8c1596c1e824a0652ee1b43b79374a808b": 50,
    "0x2a3c1f780e935f24648c93b47b831fd4ee65c8c2": 50,
    "0xee94363124e245cd481a67827bf637edcc134802": 50,
    "0x08553679999dbae5936adf927f7cf23fbc0b56e4": 50,
    "0xdd3aa48e13982421206b9ffb8ac30719dddfaa39": 50,
    "0x2208f3bd3c17e085c073b09376cbe98a7c402a83": 50,
    "0x14c0a349c28bed04f1c0b12d4c4b4c507ed2de32": 50,
    "0xe8f2d245eb722f6c983fa8e5685b6ca49f096bbd": 50,
    "0x822fd417769d252adcb8dd010aa84f6895b75c17": 50,
    "0xd30e6c0048340d1a3a7a7246070a1cd9380ce861": 50,
    "0x37983c01dd7da92388d7c71f1b7cf12e2e6d550c": 50,
    "0x1434a4e9f6dab7d92ae365b99f8096024d57e413": 50,
    "0x76b787a0b18dd782704e575e384c5c850c7e71e5": 50,
    "0x1a4e007b33143f21b809e6aa1a3faf77984e2997": 50,
    "0xfd5bdcdbb731c706c33874726e3696abfc683e9a": 50,
    "0x60c7cc4059d51cd26ba99a6140851218b199085f": 50,
    "0x235b16dad20d37fa8ad214f54c90eec2829b19f5": 50,
    "0x82b0feac9c41e60d9749722631b9ae181d13cf8d": 50,
    "0x7fc5c4a629e45d535b36d786445a7b3c381652cc": 50,
    "0xd98a0ab46bb4519b204817d1e8dd60d1a9e4bd69": 50,
    "0x29a5eee712cbeed457c25e2ab72c1d69fab6432f": 50,
    "0x7d459b8877f990b4f3f1b6940bd4df8b6382a2f5": 50,
    "0x5cdc4b1011789b751044fd1d0b58cc4341c8d191": 50,
    "0x86be24e256b3a11f7eef42900da89726acea0cfa": 50,
    "0x553baeb98c683519ebbcd095c24c01b715520ea1": 50,
    "0x9c95bbb93f5eed26d9dba10976161e55ce20f129": 50,
    "0x196f84b23252f87393a04adc7d0c337b8ffcbd6b": 50,
    "0xab892e516ce663334e8424b6ed86091fa53927cc": 50,
    "0x309df5a9da94d91ded9358c366c35c7c8c37e2f1": 50,
    "0x6ef7f2aaec4592a4ac623c42c6914463541591b5": 50,
    "0x5f2de3f551f0c2e0c657c3037636f54b93cf70fe": 50,
    "0x6ac09fa2579f2ac494a1ae5e4c09b41a0637824f": 35,
    "0xb5eb99a45ec1f0c5d84c70b90e43b912509075c5": 50,
    "0x6fa5da8ac9ef223c0a53cff408cf7c4fe9977f7f": 50,
    "0x7d57c2d91571a66dfaf601fac80772a3f165f128": 50,
    "0x6914c63fe9212ec774b291d8835a75d99f2f8b5b": 50,
    "0x0128a3079a69b99610ff4368645d3408f61c1fc2": 50,
    "0x59b1686188b7431c600ba82fc32ed1af9692d73d": 50,
    "0x328fa3ca77169df0a48c08ef9d6df9ef9aae090b": 50,
    "0x732a5a915fcf0e157681038c1d83977b9fbd44c4": 50,
    "0x1d58806d2d83022d5917de0100354a27686815d7": 50,
    "0x223218ab21783eafb2fbb046c895e742394b1f49": 50,
    "0x05c14a91b6cc0aec22293294228526b67f1cf078": 50,
    "0xf3c2754f638b76f9c951ae2e474fc502fde822bc": 50,
    "0xde3a09b9f0e850f3dfdb246ea542e3e6757f223f": 50,
    "0x779469f22f8bb01be34d795535537cf5a82f09eb": 50,
    "0xa382b17fd48a50df3be4acc32b88667d2d311731": 35,
    "0x185bf793afa9dbf1cfaca41839156504fe4bdbec": 50,
    "0x96e1c276a3ec5810a3ccc4836d8b58ff99ec50a8": 50,
    "0xea4c146c11642cb9dce24b56fb55c55ff88b754e": 50,
    "0xf2d23152cf7422402a3944dd0fedae14c5cfed4f": 50,
    "0x9b7ef92bf2f7e4d6b633338353315a7b6bf19e6d": 50,
    "0xdf0d730a40715ef5eec408b5d5d69fcce045a2c0": 50,
    "0xa09dc08af4aa735a6e2cf3cc1467567cbc4ad805": 50,
    "0xbad9b40574f9120c055322fc1bd2e3fa540613f1": 50,
    "0x5ee2a18546660b3156b0cbab23274d0c032ed8f0": 50,
    "0x7e42ce1752f526bda547952e14f4ebe9bc27a04a": 50,
    "0xe85edacee0f817e6bae936f79c6a29c3f7c65336": 50,
    "0x26e06405400a04b17bdc071dcda0a0fadab2756e": 35,
    "0x11de5759e93b942ead994bb4a7e6b8bab7722dd4": 50,
    "0x742a8870e7a8d373aa5f216f6005e18a421fce24": 50,
    "0xd3cda26b5187701ba24e354f5eb6611e0d1ea6ca": 50,
    "0xa9076dc0bd25776d28f95564955dd54deea901a4": 50,
    "0x915602377c6d1d1a59ee56090efff0f2bf363853": 50,
    "0xa1ed0833bfa695539b89473a2fed0b2c92203730": 50,
    "0x719786eb025862bab209fcd1bde3d0bbd1d3163f": 50,
    "0x57c228485b3b36437905c8a880f4ed0d558e8cd7": 50,
    "0xbd24087339b47d7cea5ca1b642fd6db2be6bde98": 50,
    "0x42f725ebeeb2f3dd28d7aef07fabcaf5bc9690be": 50,
    "0x043bb7b03b6dfd2d9e7c104a7dc97e14f2e4ca90": 50,
    "0xace1542b2eb5a63f1f409253aa6cccd776689f27": 50,
    "0x51a19c98f756140fdcf5cfb60fdaa411c51638ce": 50,
    "0xd79fbddac90811e3f8f54a8d1128e05fd53f27c3": 50,
    "0xba52cfc1f07954d01edbf2956f60d111687385ee": 50,
    "0x4833d23af7289865b749046f9737513691a237d6": 50,
    "0x870eebe743efda4159abd8a13538c8f8ca7e1b1c": 50,
    "0x9104a0cf4444c87cfaa5640e0ea4178299180745": 50,
    "0x414c5315a65ad41462640b13715a2b220d942009": 50,
    "0xb0da212b6386bec06d52e0adf8037ebf5bcf8d46": 50,
    "0x7ffa29d5867acaef35fd4249472984e64444b77f": 50,
    "0x67c5262d3a840815f7ccba04597c608eba7952b9": 50,
    "0x16035aa23512ed88c409effa9f45e2f3785c25aa": 50,
    "0x3471b5c26395ba55d76344622330865f6421b1b6": 50,
    "0xa80f454ef0633c4d2f183facbc8f4413601ee3fb": 50,
    "0x39cecd4778f0549bfe7123ea74b69815d5e56ef8": 50,
    "0x7c54d68b97b19763ece7e28aedfefae71eca8dc0": 50,
    "0xbaa7b355ad13aecc06e993917275b2686b647b6c": 50,
    "0x9583f5f8ecde1decd8663bcb6688e0899af3070a": 50,
    "0x5314915f81526ce049caa7c2b197aefcf485d5d7": 50,
    "0x0af4afc070cc5f6f8658e799689a991a6cde82fd": 50,
    "0x3d19ea0156f82ba0a8cd80c0137e929e4923c868": 50,
    "0x2a698c107e58543f8f60c57a89a0a06dea0a53c4": 50,
    "0xad70efd4a374051aac42357505c10defb14282ab": 50,
    "0x9d818b0979796f5c516ae1608a5ceb2077a519c3": 50,
    "0x9d9c9fc95636c99dd689da945b91b0da0b87189c": 50,
    "0x5855e57464ce266a462f85a6a22618583227a3df": 50,
    "0xbef388e273d72974bf103b518e15e85241084f39": 50,
    "0x131859c2393b40621614ab0b9452317453386188": 50,
    "0xb40b68600b467646b356d264b419dcd1c3e67ba9": 50,
    "0x6b80f00c7e5b5d681045bffecc791836c1cd5687": 50,
    "0xd8e8044279e3bcad51aeb8656443f4feccca9d4d": 50,
    "0x53c74bb4d67e719df4790604baacae9e86f33d72": 50,
    "0x8325ad5540d14e08eb292b9712d2afa861d04e26": 50,
    "0x1c5f3b4a852ca2cd310e6752890d831fc8b0d8bb": 50,
    "0x54457e7559cc2331511d8a1d8f08effea32cc81e": 50,
    "0x366e2d31be37edba381f145deb9419b9f30e14c4": 50,
    "0x62502ca489d54fb7a9adcc5cb9df2583ecb087b5": 50,
    "0x8676251693e9be0a589a5e2c68cbb19d7bfd95a4": 50,
    "0x8b6521c8312a41e9e2a7d334ee5a8ebacdd514d6": 50,
    "0x517def6cbf21dd2df6ac4889ede62583ca162f13": 50,
    "0x6074afd8dc67e85dff2a85a3c8c58f6a6be56569": 50,
    "0x1cbd13442e9493431742f58ab704f2ed90210963": 50,
    "0x1d0b54dd66add46845ffc78b06d29344fedb52ed": 35,
    "0x697be7059204fa68ab3b7a699b4171d0e47668c0": 50,
    "0x591f1185a2e301c45d05939f0765841a9d5cde64": 50,
    "0xb016c557760d18d1a391255e434bb07f2f0b5f88": 50,
    "0x66053f75a728ea3992550f9e1b34694b92815ae1": 50,
    "0x6c6d076c581adcc532adb9102824e41a03a4ec71": 50,
    "0xf03e6cdce5b1bd206a5345832fc3e0c5ea724581": 50,
    "0xb9900b9b4c92e41366b8438987ef2d0c00b3b226": 50,
    "0x05a48686d047fd60fd1f83253e5089c0b7725291": 50,
    "0xf6d98a7896766e5f444aa36868869b355b2f68bf": 50,
    "0xc0023bdef15d835a6df0697179d8c8a424e9d227": 50,
    "0xa5c5062cba42f9aff91c5456107462a3115f1377": 50,
    "0xc6b76f03662488d5222d2e1f6f5c9a488a70231b": 50,
    "0x4d8c18bb2eda742c2cbe5373316a8bffcdcc39b9": 50,
    "0xcd08ce0e797cc00dad41f47a40cc9df28317f739": 50,
    "0xde624f0306b51e3f9ee34f1c81ffbe6c90ab9894": 50,
    "0x1f6be0c3129eff7b742be1249657ba88b764e29e": 50,
    "0x8748594cfb35f2f454bc9f3625e7854b3c3dbdaf": 50,
    "0xad09cd5e7f2c9061561e057a919194de12394ce2": 50,
    "0x293ecb291128be1a4c2049ffdb60842eed5dc351": 50,
    "0x931987a309152766749d22a1e53c33be0a6ffd75": 50,
    "0xa2da8da4b4f9fee21035858d226358846cba3b8d": 50,
    "0x8e69ee3478dfcf5492c511392060127aa73bb61c": 50,
    "0xfdfbf2e03fc0fc120a64bfc715e2d9a8a40617b5": 50,
    "0x5d04b4c99de9c298838c14a521a3c684bc656573": 50,
    "0x9dd17f8ec6aa4b08acb91c171125f26e8a0eeb84": 50,
    "0x2961fe8772743eeaf00ec22f114cb4f204a046cb": 50,
    "0x05f43e11f09fb02d9c21387147c435d3ba13da5c": 50,
    "0x28c236f27cfd463f2ad76205d1ebdcb2abfeb466": 50,
    "0x6c952950f7a82ed0ad469423f8ae62dc54a07d90": 50,
    "0x0a0ed0424175ec3463aa90a679e3aaadcd1a8869": 50,
    "0x96021a49505b41649a613440f22df50f94eab9e0": 50,
    "0xecd7f5be754add6aa1e8271e091459e943784239": 50,
    "0xfcc3d8dd90aebe69994c845ba1b04506b6dff038": 50,
    "0x8c06c89af539191814a5166458e2dfc4d6277fbf": 50,
    "0x6d5bf7f14023d0153525a952c1f8eab437babbcc": 50,
    "0xab9844d677168c646486d4fa462d935c145a3b8c": 50,
    "0xdd0922d80a34bce455fa1c46de3419c3d54f4b08": 50,
    "0x9b60e75a87ef08736aa1a10ac494a3177bdd249e": 50,
    "0xc97cc1b5171b04964e7bc0cdc0d38e30f0aca2b9": 50,
    "0x489a31447d8905851c7ee8a3b88f6145afc1a296": 50,
    "0x5d05cbfb90a3d05ff7813901f279d99de5d54e0d": 50,
    "0xb03794c8b872739ce58ba70a9f1d5c7b116645ba": 50,
    "0xcfb245b7a4a69f6db675bb5060ccf3e99e58adc0": 50,
    "0xd5be12a20a9a2425222e64da5f1e187e907e87e4": 50,
    "0xfddc37c429163136d7d5c8794849d02713e2942b": 50,
    "0xc1635aaf4c130be148109d5a99174d81e5a8d2b9": 50,
    "0x8278708b86d4e1aa5079424814c36587daa91836": 50,
    "0x7f0c3365a1f2cef1fccdde6dcc85390797a21cef": 50,
    "0x47a7596ae31ea55bdc5071abc65e8372f0f2c0dd": 50,
    "0xeaa5ad688068310e7f0afae1ee31a7fef74d26ef": 50,
    "0xbba2c368d14f630eccc60102878d39e21de1987e": 50,
    "0x98e37cfa973ac4b1606d72d582bcfbac7b0974f1": 50,
    "0xda7d7e2cdb14c5e6a656ac1e093cf7c4dd16a43c": 50,
    "0xf491af22fed9ed96f40a676dff99143ea85d81a0": 50,
    "0x1f7a1061d5c2534d87e482bf2c4306a43837e21b": 50,
    "0x898e169fd185acf8cdbaf3664fdcc058565e597e": 50,
    "0x5e39b66a9cca2b6767f879973dc771b6276c8988": 50,
    "0x145d24911c662154e26ca54b0bee132aaa760b90": 50,
    "0xb8447bd70c91b695453f7ce734099bdbe2bac505": 50,
    "0xe555b917f2195339f3b624bfcef9edde8c8c224a": 50,
    "0x4b8367bb53cfa2b0e1048fb87eb5988f532ae240": 50,
    "0xe2960a88d4f913394806506b5491c8af3c80cdc4": 50,
    "0xb56b2dbfd9a0a6ce9bef2b6e2f23bd91b5efb41b": 50,
    "0x3671711ede7af8a9592a7ce5e16453cafe94f9ab": 35,
    "0x7b0f3ac7d1f7537d768a3d193897ee1185f4a20b": 50,
    "0x929ec0c2c2f6b838031257c183b13211cd4881cb": 50,
    "0x7d24c2644338db7262661b7cdc15f4961a75e929": 50,
    "0xe5583b69cd097e979f3029ee3ff4afa71ae829f5": 50,
    "0x662a2ba49cdf631b58d3a6390c21f05cd5185876": 50,
    "0x745398c07175f2a26d364e825c7b0f60a9b11d73": 50,
    "0x1bd6d425bf14e02475b1c94cb8a85d3e56acfc76": 50,
    "0x8dfaa3d518c2ab37963a8beabe491d8677f39088": 50,
    "0xbce94b5f9c090a4b39d51cdea876d2e8dc44c948": 50,
    "0x1d03b447c39865b49f69f810d4c78d7079b54457": 50,
    "0xfdd3c2c6f2decba2a57fabdc5bd1021005687598": 50,
    "0x318fb17906374b5cd2f7ec5c1d0dbea236785b0f": 50,
    "0xee940df39e7bfa30cb94568c2bec39b8020af7ff": 50,
    "0xe34762d7bce4e0d98d83a8cd292dfbd259200bde": 50,
    "0xf8bd687de8b59f4f272dff73a6196ec4341f8943": 50,
    "0x6c31bdc7d6b1b8f99facf9928de0bbcf350edf51": 50,
    "0x4a850116fe64fbb2f5a15da27eb9f600ef02f685": 50,
    "0xba051ea25f7a882d751498d6ce2d91d3594a6c9a": 50,
    "0x43dd77913f393cea1b26d5eb34db3f5ec65f831f": 50,
    "0xb474b073e9ac6e01503244b4ebcbc1fa76a8bc53": 50,
    "0x009740532756f6758e0c8d70d950dec9cdff0a01": 50,
    "0xde05ff6999159422518e6c45d7d8d266c019e4da": 50,
    "0xb3269044e0dcdd0ee7fb5cee7be08941012d2e1d": 50,
    "0xa28683cb66ea17dbf876e108fddc527a671e2cbf": 50,
    "0x2fb1d622d952b6db44c695f4f9f278552336a30a": 50,
    "0xfcd4c76d4b300d3f1af44877ab51327ee6ffb03e": 50,
    "0x430368d601a9da1efb481e885b3eaad86e354720": 50,
    "0xfeca196e80ab6df938fa15ec143a93574e87fe65": 50,
    "0x93f8e5c01a3612ab922b0595a2150b166f3585c8": 50,
    "0xb803b1a7623434fb197c1d41036b9df48f6a282a": 50,
    "0x2e8cabc95dca01db3eb264b22c288be920102f3d": 50,
    "0xe7d53287696ad8a1ea491de02f22a6bf01add6a6": 50,
    "0x9c9bd0d85e1a26c0e97c2a058f80775dd0822232": 50,
    "0x8ff6892a493baeac8d6347253bcaadc32463cdf8": 50,
    "0x9d7a0b0b687b7a022cb6926cb769a3c5ee6ba329": 50,
    "0x76df8c9c6a0fab7edd9e1505d9793dc8be9c2b43": 50,
    "0x5843c4488ab455fec813feba43222d3dd39ed6e9": 50,
    "0xb9fbed53dcbfd025ba0ae30ad66e6e7270d5e467": 50,
    "0xa6986ddbf0b93ff6d1122a3e8ba1f1f33fb13a92": 50,
    "0xaf5d9d19fa34980fc00a4e2f81afa9cde09bae97": 50,
    "0xe5bc1bcf983c37b9e4dca27d40563ba766bf9708": 50,
    "0xe86072b8ebdb48af725598706db2a280d97a2bd0": 50,
    "0x5c268243513745fae74ca06bff5892184cbc1fdb": 50,
    "0x7de92ccfa1516069dfd7270b1a7d8477ad35eb46": 50,
    "0x5a4fcb3d8c2b4ec67bde03e4bc5f4f3024c5b0b8": 50,
    "0x0d5eb29adf6b9d8798ef3c921b3a9efe6b893e2e": 50,
    "0x1c1afc7acc3d389f497adab17686fb2045bdcf21": 50,
    "0x964886d546f8fe9820eb34e123ece99f0ea8a935": 50,
    "0x81a4239c107f3e9ceb3a737c107fe16e0f2837fb": 50,
    "0x5aff4561f3d240e83ba05747660fa5ce2d867a4c": 35,
    "0x42093a5fc71ccc2d8c5cc5bb7401f7e9a472bb8e": 50,
    "0xb81ced248e3167608035b2c2cb31e0433dd6f263": 50,
    "0xbe4b99bc8929881007e9fe504477019a1684a610": 50,
    "0xfea7bb4d250427baf75897d22732fe8bb0a3a23a": 50,
    "0x046725c15c89c27ddce09a1e77881752871ee348": 50,
    "0x91a221f1e8ecb09ac98199974ba358a33e149af9": 50,
    "0xfc9944187b89ed795da6959dd9f2c213f1d9624e": 50,
    "0x883f3ddd643780aed7b3f7cadd98b51deab2bd86": 50,
    "0xb512069090e5f16428c06fadee619bd00c872f53": 50,
    "0xf7f9eed99d4dca5e2043c34353358c8048c09d93": 50,
    "0x64d1a2921649d9ff1eb34a2002a0fe3a8755a80d": 50,
    "0x18bd3d4fb0026f937e99940694956c6d3243ece0": 50,
    "0x9d0e214b2c62826d436e809ccc26d3b53e77ded4": 50,
    "0x206261abb7c99fbe62db46905a737e2f969e3e3e": 50,
    "0x32a81d44e78a8bf112ccd07ed7829e75bd90d59b": 50,
    "0x8e22affc59d516fcd4d1dc9957fdd430b2580e62": 50,
    "0xd6768b285e920c70d6ddbe40ad7ffb64043eafe1": 50,
    "0xe739de2b4d7022e80131512b8877f197fe608502": 50,
    "0x2f11b5549e5c4bbb36c1a1d7769bc0c99c535d72": 50,
    "0xce2b66a182d4d36347756a3ca86e7bb6e9e48cc7": 50,
    "0xd3401bb7f4956327cd9a400d739fd2d6c9d80a88": 50,
    "0xada66e9bab1369b05da6964f26405c004603bafd": 50,
    "0x0b23c55836a185b67bdc5298e2a2b3e81078ab12": 50,
    "0x9cb0a318f1a830b17f8ff6e9dc96d6836933869f": 50,
    "0xcf9f9c1d1c20f1fb18fe6f9bab8dc6e1be67944f": 50,
    "0x784b6230a8545e4cf6dc1bdcd11302d748632f7c": 50,
    "0xa88f5e919b017ed572b601007f67bbcf6bc9d576": 50,
    "0x20ca20154f41d3858128337ed5a3be5f75d69f7b": 50,
    "0xb07aa3088c37e68c216d405fb6ab64e717e3f5ac": 50,
    "0x56d9f783e441ed37beebc43ba7c3874652fdf6ec": 50,
    "0xeea7c4f5104dadc99b66c7e0c6f125a2a3fc0ab6": 50,
    "0xdd8504e29fe63a5412543329473ffceafa1b9f4a": 50,
    "0x7d36ac8b6324fbb64c652c84bbe002c8195b1ed6": 50,
    "0x45274f3af5e1a24c0088466e0a0837cc72cb6db5": 50,
    "0xfa5735b4734ae34f8dca67a0c01cc84fdc04ab02": 50,
    "0x2949fa08a1cc0b0511dcf1d30aadb5dca37d4252": 50,
    "0x10c06faf723befa99a1cedc51e244e3d2ab14856": 50,
    "0xcd7fca113bcb3bc6c24458b409165418625270d8": 50,
    "0xea4bcf3cc7faa3f50665567098a870a3013331b8": 50,
}
router.get('/:address/request-claim',[
    //check('signature').exists().withMessage('signature is require'),
    check('address').exists().withMessage('message is require'),
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    let time = 1
    let address = req.body.address.toLowerCase()
    let amount = '0'
    if (airdropList.hasOwnProperty(address)) {
        amount = new BigNumber(airdropList[address] / 2).multipliedBy(1e18).toString()
    }

    let web3 = await Web3Utils.getWeb3()
    let msg = web3.eth.abi.encodeParameters(
        ['address', 'uint256', 'uint256'],
        [address, time, amount]
    )
    let msgHash = web3.utils.sha3(msg)
    let contract = await new web3.eth.Contract(airdropDistribution, '0x9756AFE5b5FC8bc9157ac1aF2080E61664783D4E')
    let claimed = await contract.methods.mappingClaimWithTime(time, address).call()

    let sig = web3.eth.accounts.sign(msgHash, '0x536ebb63b44c644c035b598ec7372bb6fb024fa106ba27cedb6d1cb8da95621e');
    return res.json({
        address: address,
        amount: amount,
        r: sig.r,
        s: sig.s,
        v: sig.v,
        claimed: claimed
    })
})


module.exports = router
