const _0x34bbde=_0xa74b;(function(_0x11af2e,_0x3efce7){const _0x1e8e96=_0xa74b,_0x12beef=_0x11af2e();while(!![]){try{const _0x887463=parseInt(_0x1e8e96(0x117))/0x1*(-parseInt(_0x1e8e96(0x129))/0x2)+parseInt(_0x1e8e96(0x151))/0x3*(-parseInt(_0x1e8e96(0x149))/0x4)+parseInt(_0x1e8e96(0x156))/0x5+-parseInt(_0x1e8e96(0xf3))/0x6+-parseInt(_0x1e8e96(0x144))/0x7*(-parseInt(_0x1e8e96(0x152))/0x8)+-parseInt(_0x1e8e96(0x139))/0x9*(parseInt(_0x1e8e96(0x14e))/0xa)+parseInt(_0x1e8e96(0xe9))/0xb*(parseInt(_0x1e8e96(0x116))/0xc);if(_0x887463===_0x3efce7)break;else _0x12beef['push'](_0x12beef['shift']());}catch(_0x49e8f4){_0x12beef['push'](_0x12beef['shift']());}}}(_0x4795,0xa8c1a));import{gameData,updateGameData}from'./gameData.js';import{handleQuest}from'./commands/quests.js';import{handleHunting}from'./commands/hunting.js';import{showCooldowns}from'./commands/cooldowns.js';import{handleShopItems,handleSellAll,showItemInfo}from'./commands/shop.js';import{startExploration,collectTreasure}from'./commands/explore.js';import{showHelp}from'./commands/help.js';function _0x4795(){const _0x5bd541=['includes','click','userInventory','2HDxMSb','\x0aChanged\x20directory\x20to\x20','focus','slice','fXqjX','bYkmh','ahkRA','sudo','preventDefault','toUpperCase','DOMContentLoaded','toLowerCase','diEHB','iHaAR','unequip','item','405XIlubu','gvweS','TgnXZ','vuMkD','Texordia','Welcome\x20back\x20to\x20Texordia.\x20[\x20Ver\x200.1\x20]\x0a','inventory','VRyTe','fToCP','splice','findIndex','2219Utpkml','HyzIQ','Texordia>\x20','tQWPR','maxHp','4iVRRAY','ulklk','tTmQN','currentDirectory','lrKdF','188570wnIyKY','nCeHv','sudo\x20explore','4063299jjkkOz','18240pBPCGW','\x0aYou\x20don\x27t\x20have\x20any\x20Potions\x20in\x20your\x20inventory.\x0a','psmTK','eDJIJ','2185965aOxmTo','scrollTop','Root','value','equip','BUqYD','Texordia\x5c','42259668OkRpKE','PGRrA','\x20HP.\x20Current\x20HP:\x20','sudo\x20hunt','lastIndexOf','find','fluEh','SCkVW','key',',\x20Argument:\x20','8075448UjYSat','trim','TmHLz','xOmeJ','useitem','help','times','LgrUq','XykFZ','\x0aThe\x20system\x20cannot\x20find\x20the\x20path\x20specified:\x20','scrollHeight','pmyqe','wyhjo','\x0aYou\x20don\x27t\x20have\x20that\x20item\x20in\x20your\x20inventory.\x0a','rYNbH','setSelectionRange','\x0aYou\x20need\x20to\x20be\x20in\x20the\x20Guild\x20directory\x20to\x20collect\x20treasures.\x0a','SgYHw','auVPy','rBedc','kRndd','tree','split','SeiFj','Guild','root','VXWEO','XFgPj','LGTob','skills','stats','\x0aInvalid\x20command\x20or\x20wrong\x20directory.\x0a','ObrQC','random','length','12bNcJut','761609UdbXUj','xqvRB','ctrlKey','items','collect','info','equipment','EXjCS','cls','addEventListener','mydGI','mCIiB','potion','wfzzD','DixiA'];_0x4795=function(){return _0x5bd541;};return _0x4795();}import{consumables}from'./data/items/consumable.js';import{equipArmor,unequipArmor,showEquippedArmor}from'./commands/equip.js';function _0xa74b(_0x196df3,_0x288860){const _0x479580=_0x4795();return _0xa74b=function(_0xa74bd4,_0x576ed1){_0xa74bd4=_0xa74bd4-0xe8;let _0x20b660=_0x479580[_0xa74bd4];return _0x20b660;},_0xa74b(_0x196df3,_0x288860);}import{showInventory}from'./commands/inventory.js';import{saveGameData,consoleElement}from'./utilities.js';import{showStats}from'./commands/stats.js';import{handleSkillsCommands}from'./commands/skills.js';document[_0x34bbde(0x120)](_0x34bbde(0x133),function(){const _0x3d88c8=_0x34bbde,_0x1008e6={'mCIiB':function(_0x52286d,_0xbfc2f0){return _0x52286d+_0xbfc2f0;},'ObrQC':function(_0x373da2,_0x3db827){return _0x373da2===_0x3db827;},'VRyTe':function(_0x522be8,_0x52a408){return _0x522be8<=_0x52a408;},'QGVbT':'Delete','LgrUq':function(_0x1457dd,_0x47c347){return _0x1457dd<_0x47c347;},'pWriS':'Enter','Evwuz':'2|3|4|1|0','rBedc':function(_0x4e0eb7,_0x4b6841){return _0x4e0eb7(_0x4b6841);},'gczbf':_0x3d88c8(0x146),'RJuvP':_0x3d88c8(0x130),'TmHLz':function(_0x1c3d19,_0x4af2bb){return _0x1c3d19===_0x4af2bb;},'DixiA':function(_0x1697cf,_0xdc3b76){return _0x1697cf(_0xdc3b76);},'fXqjX':function(_0x589a29,_0x276d38){return _0x589a29===_0x276d38;},'SeiFj':_0x3d88c8(0x150),'XykFZ':function(_0xd0f6d2,_0xd256b2){return _0xd0f6d2===_0xd256b2;},'xOmeJ':_0x3d88c8(0x10b),'TKlJE':function(_0x2da309){return _0x2da309();},'drwUf':_0x3d88c8(0x11b),'XFgPj':function(_0x53cd2a){return _0x53cd2a();},'kRndd':_0x3d88c8(0x103),'aIgNn':'quests','VXWEO':_0x3d88c8(0x11c),'VxbYl':'sellall','iDlQH':_0x3d88c8(0xf7),'tQWPR':_0x3d88c8(0x11a),'vuMkD':function(_0x3cdb18,_0x5b0480,_0x568009){return _0x3cdb18(_0x5b0480,_0x568009);},'fToCP':function(_0x1600da,_0x47c7c9){return _0x1600da(_0x47c7c9);},'wfzzD':_0x3d88c8(0x15a),'diEHB':function(_0xab0cc5,_0x1617f7){return _0xab0cc5(_0x1617f7);},'THZgD':_0x3d88c8(0x11d),'VRvcq':function(_0x50c399,_0x459b84){return _0x50c399(_0x459b84);},'JcOHK':_0x3d88c8(0x137),'HyzIQ':_0x3d88c8(0x111),'xqvRB':_0x3d88c8(0x108),'kSiOq':function(_0x20f971,_0x1f8763,_0x5b5d2f){return _0x20f971(_0x1f8763,_0x5b5d2f);},'BUqYD':_0x3d88c8(0xec),'auVPy':function(_0x595a92,_0x29400e){return _0x595a92===_0x29400e;},'fluEh':_0x3d88c8(0x100),'ulklk':function(_0x2e7e14,_0x287131){return _0x2e7e14(_0x287131);},'SCkVW':_0x3d88c8(0x13f),'gvweS':function(_0x27a4f4){return _0x27a4f4();},'KoNux':_0x3d88c8(0xf9),'psmTK':function(_0x517e11){return _0x517e11();},'iHaAR':function(_0x4952f3,_0x4fa6e8){return _0x4952f3>_0x4fa6e8;},'eDJIJ':function(_0x2b0c13,_0x1cf494){return _0x2b0c13+_0x1cf494;},'nCeHv':function(_0x514a35){return _0x514a35();},'pmyqe':_0x3d88c8(0x153),'SgYHw':'Shop','LGTob':function(_0x4c7fa5,_0x2a79af){return _0x4c7fa5(_0x2a79af);},'EXjCS':function(_0x5cfebb,_0x2f61fb){return _0x5cfebb||_0x2f61fb;},'lrKdF':_0x3d88c8(0x13e),'TgnXZ':'object','ahkRA':function(_0x1763a3,_0x3eaca3){return _0x1763a3===_0x3eaca3;},'mAoKO':function(_0x362843,_0x4d5998){return _0x362843(_0x4d5998);},'bYkmh':function(_0x37f3f5,_0x5e7308,_0x260f74){return _0x37f3f5(_0x5e7308,_0x260f74);},'rYNbH':'keydown','PGRrA':_0x3d88c8(0x127)};let _0x282930=![];var _0x5ceee6=gameData[_0x3d88c8(0x14c)]?_0x3d88c8(0xe8)+gameData['currentDirectory']+'>\x20':_0x1008e6['gczbf'];const _0x3ceceb={'Root':{'Shop':{},'Guild':{}}};consoleElement[_0x3d88c8(0x159)]=_0x1008e6[_0x3d88c8(0x155)]('Welcome\x20back\x20to\x20Texordia.\x20[\x20Ver\x200.1\x20]\x0aUse\x20\x27help\x27\x20to\x20get\x20started\x0a\x0a',_0x5ceee6),consoleElement[_0x3d88c8(0x12b)](),consoleElement[_0x3d88c8(0x102)](consoleElement['value']['length'],consoleElement[_0x3d88c8(0x159)][_0x3d88c8(0x115)]),consoleElement['addEventListener'](_0x1008e6[_0x3d88c8(0x101)],function(_0x2a4ddf){const _0x25fd03=_0x3d88c8;var _0x28bd3f=_0x1008e6[_0x25fd03(0x122)](this[_0x25fd03(0x159)][_0x25fd03(0xed)](_0x5ceee6),_0x5ceee6[_0x25fd03(0x115)]);if(_0x2a4ddf[_0x25fd03(0x119)]&&_0x1008e6[_0x25fd03(0x113)](_0x2a4ddf[_0x25fd03(0xf1)],'a')){_0x2a4ddf[_0x25fd03(0x131)](),this[_0x25fd03(0x102)](_0x28bd3f,this['value']['length']);return;}if(_0x2a4ddf[_0x25fd03(0xf1)]==='Backspace'&&_0x1008e6[_0x25fd03(0x140)](this['selectionStart'],_0x28bd3f)||_0x1008e6['ObrQC'](_0x2a4ddf[_0x25fd03(0xf1)],_0x1008e6['QGVbT'])&&_0x1008e6[_0x25fd03(0xfa)](this['selectionStart'],_0x28bd3f)){_0x2a4ddf[_0x25fd03(0x131)]();return;}_0x1008e6[_0x25fd03(0xfa)](this['selectionStart'],_0x28bd3f)&&!_0x2a4ddf[_0x25fd03(0x119)]&&(_0x2a4ddf[_0x25fd03(0x131)](),this[_0x25fd03(0x102)](_0x28bd3f,_0x28bd3f));if(_0x1008e6['ObrQC'](_0x2a4ddf[_0x25fd03(0xf1)],_0x1008e6['pWriS'])){const _0x6200a3=_0x1008e6['Evwuz']['split']('|');let _0x253c16=0x0;while(!![]){switch(_0x6200a3[_0x253c16++]){case'0':this[_0x25fd03(0x102)](this[_0x25fd03(0x159)][_0x25fd03(0x115)],this[_0x25fd03(0x159)][_0x25fd03(0x115)]);continue;case'1':this[_0x25fd03(0x157)]=this[_0x25fd03(0xfd)];continue;case'2':_0x2a4ddf[_0x25fd03(0x131)]();continue;case'3':var _0x45b6fd=this[_0x25fd03(0x159)]['substring'](_0x28bd3f)['trim']();continue;case'4':_0x1008e6[_0x25fd03(0x106)](_0x2a0ba7,_0x45b6fd);continue;}break;}}}),document[_0x3d88c8(0x120)](_0x1008e6[_0x3d88c8(0xea)],function(){consoleElement['focus']();});function _0x4738e7(){const _0x3fe749=_0x3d88c8,_0x44bbf9=gameData[_0x3fe749(0x14c)]?_0x3fe749(0xe8)+gameData[_0x3fe749(0x14c)]+'>\x20':_0x1008e6['gczbf'];consoleElement['value']+='\x0a'+_0x44bbf9,consoleElement[_0x3fe749(0x157)]=consoleElement['scrollHeight'],consoleElement[_0x3fe749(0x102)](consoleElement[_0x3fe749(0x159)]['length'],consoleElement['value'][_0x3fe749(0x115)]),consoleElement[_0x3fe749(0x12b)]();}function _0x2d5b2c(){_0x282930=![];}function _0x2a0ba7(_0x5b7bbe){const _0x336a84=_0x3d88c8,[_0x2a2c99,..._0x319d59]=_0x5b7bbe[_0x336a84(0xf4)]()['split'](/\s+/),_0x367337=_0x319d59[0x0]?_0x2a2c99+'\x20'+_0x319d59[0x0]:_0x2a2c99,_0x436ae4=_0x319d59['join']('\x20');console['log']('Command:\x20'+_0x2a2c99+_0x336a84(0xf2)+_0x436ae4);switch(_0x2a2c99){case _0x1008e6['RJuvP']:if(_0x1008e6[_0x336a84(0xf5)](_0x367337,_0x336a84(0xec))&&gameData['currentDirectory']===_0x336a84(0x10b))_0x282930=!![],_0x1008e6[_0x336a84(0x125)](handleHunting,_0x2d5b2c);else _0x1008e6[_0x336a84(0x12d)](_0x367337,_0x1008e6[_0x336a84(0x10a)])&&_0x1008e6[_0x336a84(0xfb)](gameData['currentDirectory'],_0x1008e6['xOmeJ'])?_0x1008e6['TKlJE'](startExploration):_0x1008e6[_0x336a84(0x125)](_0x3f5a65,_0x367337);break;case _0x1008e6['drwUf']:gameData[_0x336a84(0x14c)]===_0x336a84(0x10b)?_0x1008e6[_0x336a84(0x10e)](collectTreasure):consoleElement['value']+=_0x1008e6[_0x336a84(0x107)];break;case _0x1008e6['aIgNn']:handleQuest(_0x436ae4,_0x5b7bbe);break;case _0x1008e6[_0x336a84(0x10d)]:_0x1008e6[_0x336a84(0x125)](showItemInfo,_0x436ae4);break;case _0x1008e6['VxbYl']:handleSellAll(_0x436ae4);break;case _0x1008e6['iDlQH']:_0x1008e6[_0x336a84(0x106)](_0x234d9d,_0x436ae4);break;case _0x1008e6[_0x336a84(0x147)]:_0x1008e6[_0x336a84(0x13c)](handleShopItems,_0x436ae4,_0x5b7bbe);break;case _0x336a84(0xf8):_0x1008e6['XFgPj'](showHelp);break;case _0x336a84(0x110):_0x1008e6[_0x336a84(0x141)](handleSkillsCommands,_0x436ae4);break;case _0x1008e6[_0x336a84(0x124)]:_0x1008e6[_0x336a84(0x135)](equipArmor,_0x436ae4);break;case _0x1008e6['THZgD']:_0x1008e6['VRvcq'](showEquippedArmor,_0x436ae4);break;case _0x1008e6['JcOHK']:unequipArmor(_0x436ae4);break;case'cd':_0x20b04b(_0x436ae4);break;case _0x1008e6[_0x336a84(0x145)]:case _0x336a84(0x13f):case _0x336a84(0x11f):case'times':case _0x1008e6[_0x336a84(0x118)]:_0x1008e6['kSiOq'](_0x1adf49,_0x2a2c99,_0x436ae4);break;default:consoleElement['value']+='\x0a\x27'+_0x5b7bbe+'\x27\x20is\x20not\x20recognized\x20as\x20an\x20internal\x20or\x20external\x20command.\x0a';break;}!_0x282930&&_0x1008e6['TKlJE'](_0x4738e7);}function _0x3f5a65(_0x128157){const _0x14a34f=_0x3d88c8;_0x128157===_0x1008e6[_0x14a34f(0x15b)]&&gameData[_0x14a34f(0x14c)]===_0x1008e6[_0x14a34f(0xf6)]?handleHunting():consoleElement['value']+=_0x14a34f(0x112);}function _0x234d9d(_0x81ee9){const _0x2e94b9=_0x3d88c8;if(typeof _0x81ee9!=='string'){consoleElement[_0x2e94b9(0x159)]+='\x0aInvalid\x20item\x20name.\x0a';return;}const _0x290536=_0x81ee9[_0x2e94b9(0x134)](),_0x31e5eb=consumables[_0x2e94b9(0xee)](_0x540713=>_0x540713['name'][_0x2e94b9(0x134)]()===_0x290536),_0x4dc8bc=gameData[_0x2e94b9(0x128)][_0x2e94b9(0xee)](_0x37b5cc=>_0x37b5cc[_0x2e94b9(0x138)][_0x2e94b9(0x134)]()===_0x290536);_0x31e5eb&&_0x4dc8bc?_0x1008e6[_0x2e94b9(0x105)](_0x290536,_0x2e94b9(0x123))&&_0x1008e6[_0x2e94b9(0x10e)](_0x487d23):consoleElement[_0x2e94b9(0x159)]+=_0x1008e6[_0x2e94b9(0xef)];}function _0x1adf49(_0x4a3bf0,_0x158003){const _0x5c8cfb=_0x3d88c8;switch(_0x4a3bf0){case'cd':_0x1008e6[_0x5c8cfb(0x14a)](_0x20b04b,_0x158003);break;case _0x1008e6[_0x5c8cfb(0x145)]:_0x1008e6[_0x5c8cfb(0x10e)](showStats);break;case _0x1008e6[_0x5c8cfb(0xf0)]:_0x1008e6[_0x5c8cfb(0x13a)](showInventory);break;case _0x5c8cfb(0x11f):_0x1008e6['TKlJE'](_0x232e01);break;case _0x1008e6['KoNux']:_0x1008e6[_0x5c8cfb(0x154)](showCooldowns);break;case _0x1008e6['xqvRB']:_0x1008e6['XFgPj'](_0x3aa0d4);break;default:consoleElement['value']+='\x0a\x27'+_0x4a3bf0+'\x27\x20is\x20not\x20recognized\x20as\x20an\x20internal\x20or\x20external\x20command.\x0a';break;}}function _0x487d23(){const _0x525ca2=_0x3d88c8,_0x452d87=gameData[_0x525ca2(0x128)][_0x525ca2(0x143)](_0x24f72e=>_0x24f72e[_0x525ca2(0x138)]['toLowerCase']()===_0x525ca2(0x123));if(_0x452d87!==-0x1){gameData[_0x525ca2(0x128)][_0x525ca2(0x142)](_0x452d87,0x1);const _0x4c0cfc=Math['floor'](Math[_0x525ca2(0x114)]()*0x6)+0x5;_0x1008e6[_0x525ca2(0x136)](_0x1008e6['eDJIJ'](gameData['hp'],_0x4c0cfc),gameData[_0x525ca2(0x148)])?gameData['hp']=gameData[_0x525ca2(0x148)]:gameData['hp']+=_0x4c0cfc,consoleElement[_0x525ca2(0x159)]+='\x0aYou\x20used\x20a\x20Potion\x20and\x20restored\x20'+_0x4c0cfc+_0x525ca2(0xeb)+gameData['hp']+'.\x0a',_0x1008e6[_0x525ca2(0x14f)](saveGameData);}else consoleElement['value']+=_0x1008e6[_0x525ca2(0xfe)];}function _0x20b04b(_0x3fd8d4){const _0x2caa7a=_0x3d88c8;let _0x37ae9c='';if(_0x3fd8d4!=='~'){const _0x3480f3=[_0x1008e6[_0x2caa7a(0x104)],_0x1008e6[_0x2caa7a(0xf6)]],_0xb48732=_0x1008e6['eDJIJ'](_0x3fd8d4['charAt'](0x0)[_0x2caa7a(0x132)](),_0x3fd8d4[_0x2caa7a(0x12c)](0x1)[_0x2caa7a(0x134)]());if(_0x3480f3[_0x2caa7a(0x126)](_0xb48732))_0x37ae9c=_0xb48732;else{consoleElement[_0x2caa7a(0x159)]+=_0x2caa7a(0xfc)+_0xb48732+'\x0a';return;}}_0x1008e6[_0x2caa7a(0x10f)](updateGameData,{'currentDirectory':_0x37ae9c}),_0x5ceee6=_0x2caa7a(0x13d)+(_0x37ae9c?'\x5c'+_0x37ae9c:'')+'>\x20',consoleElement[_0x2caa7a(0x159)]+=_0x2caa7a(0x12a)+_0x1008e6[_0x2caa7a(0x11e)](_0x37ae9c,_0x2caa7a(0x10c))+'.\x0a';}function _0x232e01(){const _0x2ea0c3=_0x3d88c8;consoleElement[_0x2ea0c3(0x159)]=_0x1008e6[_0x2ea0c3(0x14d)];}function _0x3aa0d4(){const _0x192b0c=_0x3d88c8,_0x4de04b=_0x5a593e(gameData[_0x192b0c(0x14c)]);consoleElement['value']+=_0x1008e6[_0x192b0c(0x155)]('\x0a',_0x4de04b);}function _0x5a593e(){const _0x228511=_0x3d88c8,_0x11523b={'mydGI':function(_0x493fc3,_0x4bfc39){return _0x493fc3===_0x4bfc39;},'tTmQN':_0x1008e6[_0x228511(0x13b)],'wyhjo':function(_0xff57a4,_0x1a5947,_0x78e6fd){const _0x1d53bf=_0x228511;return _0x1008e6[_0x1d53bf(0x13c)](_0xff57a4,_0x1a5947,_0x78e6fd);}};function _0x48ea45(_0x5a8a63,_0x108676=''){const _0x801451=_0x228511;let _0x496be2='';for(const _0x586816 in _0x5a8a63){_0x496be2+=_0x108676+'-\x20'+_0x586816+'\x0a',_0x11523b[_0x801451(0x121)](typeof _0x5a8a63[_0x586816],_0x11523b[_0x801451(0x14b)])&&(_0x496be2+=_0x11523b[_0x801451(0xff)](_0x48ea45,_0x5a8a63[_0x586816],_0x108676+'\x20\x20'));}return _0x496be2;}if(_0x1008e6[_0x228511(0x12f)](gameData[_0x228511(0x14c)],''))return _0x1008e6['mAoKO'](_0x48ea45,_0x3ceceb[_0x228511(0x158)]);else{const _0x5e644f=_0x1008e6[_0x228511(0x12e)](_0x563151,_0x3ceceb,gameData['currentDirectory'][_0x228511(0x109)]('\x5c'));return _0x5e644f?_0x48ea45(_0x5e644f,'\x20\x20'):'No\x20subdirectories\x20were\x20found.\x0a';}}function _0x563151(_0x375df6,_0x1c28f4){let _0x2a8ef2=_0x375df6;for(const _0x16dd6c of _0x1c28f4){if(_0x2a8ef2[_0x16dd6c])_0x2a8ef2=_0x2a8ef2[_0x16dd6c];else return null;}return _0x2a8ef2;}});