import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacidadePage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-center">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground text-center mb-12">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">1. Introdução</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  A Garcez Palha (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) está comprometida com a
                  proteção da privacidade e dos dados pessoais de nossos clientes, parceiros e visitantes do
                  site, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
                <p>
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                  informações pessoais quando você utiliza nossos serviços ou acessa nosso website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">2. Dados que Coletamos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">2.1 Dados fornecidos por você:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Nome completo</li>
                    <li>Endereço de e-mail</li>
                    <li>Número de telefone</li>
                    <li>CPF/CNPJ (quando necessário para prestação de serviços)</li>
                    <li>Endereço</li>
                    <li>Informações sobre seu caso jurídico</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2.2 Dados coletados automaticamente:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas visitadas e tempo de permanência</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">3. Finalidade do Tratamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Utilizamos seus dados pessoais para:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Prestar serviços jurídicos e periciais contratados</li>
                  <li>Responder a consultas e solicitações</li>
                  <li>Enviar comunicações relevantes sobre nossos serviços</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Melhorar nosso website e serviços</li>
                  <li>Processar pagamentos e faturamento</li>
                  <li>Gerenciar o programa de parceiros e comissões</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">4. Base Legal para o Tratamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  O tratamento de seus dados pessoais está fundamentado nas seguintes bases legais da LGPD:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Consentimento</strong>: quando você nos fornece seus dados voluntariamente
                  </li>
                  <li>
                    <strong>Execução de contrato</strong>: para prestação dos serviços contratados
                  </li>
                  <li>
                    <strong>Obrigação legal</strong>: para cumprimento de obrigações legais
                  </li>
                  <li>
                    <strong>Interesse legítimo</strong>: para melhorar nossos serviços e comunicação
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">5. Compartilhamento de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Seus dados podem ser compartilhados com:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Tribunais e órgãos públicos (quando necessário para seu caso)</li>
                  <li>Prestadores de serviços essenciais (hospedagem, e-mail, pagamentos)</li>
                  <li>Parceiros comerciais (com seu consentimento)</li>
                </ul>
                <p className="mt-4 text-sm">
                  Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de
                  marketing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">6. Seus Direitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Conforme a LGPD, você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Confirmar a existência de tratamento de seus dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Obter informações sobre o compartilhamento de dados</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">7. Segurança dos Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados
                  pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controle de acesso restrito</li>
                  <li>Monitoramento de segurança contínuo</li>
                  <li>Backups regulares</li>
                  <li>Treinamento de equipe em proteção de dados</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">8. Retenção de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais
                  foram coletados, incluindo obrigações legais. Para processos jurídicos, os dados podem ser
                  mantidos por até 20 anos após o encerramento do caso, conforme legislação aplicável.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">9. Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Utilizamos cookies para melhorar sua experiência em nosso site. Cookies são pequenos
                  arquivos de texto armazenados em seu dispositivo. Você pode gerenciar as preferências de
                  cookies através das configurações do seu navegador.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">10. Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p>
                    <strong>Encarregado de Proteção de Dados (DPO)</strong>
                  </p>
                  <p>E-mail: privacidade@garcezpalha.com</p>
                  <p>Telefone: (21) 3500-0000</p>
                  <p>Endereço: Centro, Rio de Janeiro - RJ</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">11. Alterações nesta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise
                  esta página regularmente para estar informado sobre como protegemos seus dados. As alterações
                  entram em vigor imediatamente após sua publicação neste site.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
