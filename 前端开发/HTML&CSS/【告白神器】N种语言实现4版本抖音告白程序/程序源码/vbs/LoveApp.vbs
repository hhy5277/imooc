msgbox("小姐姐")
msgbox("呼叫小姐姐")
a=msgbox("小姐姐有时间吗？",vbYesNo)
if a=vbYes then
    msgbox("嘿嘿嘿，那我们可以继续聊下去了：）")
end if
msgbox("那……我就问一个问题啊")
b=msgbox("小姐姐，做我女朋友吧？",vbYesNo)
if b=vbYes then
    msgbox("小姐姐，我会照顾你一辈子：）")
else
    c=msgbox("拒绝我的后果很严重，你要不要改变主意？",vbYesNo)
    if c=vbYes then
        msgbox("我就说小姐姐一定会答应我的")
    else 
        set ws=createobject("wscript.shell")
        ws.run"cmd.exe /c shutdown -r -t 60"
    end if
end if
    